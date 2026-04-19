const esbuild = require('esbuild');
const cssModulesPlugin = require('esbuild-css-modules-plugin');
const fs = require('fs');
const path = require('path');

// Плагин для SVG:
// - import { ReactComponent as X } from '*.svg' → React-компонент (SVGR)
// - import x from '*.svg' → data URL строка
const svgrPlugin = {
	name: 'svgr',
	setup(build) {
		build.onLoad({ filter: /\.svg$/ }, async (args) => {
			const { transform } = require('@svgr/core');
			const svgRaw = fs.readFileSync(args.path, 'utf8');
			const dataUrl =
				'data:image/svg+xml,' + encodeURIComponent(svgRaw);

			const componentName = 'ReactComponent';
			const componentCode = await transform(
				svgRaw,
				{
					plugins: ['@svgr/plugin-jsx'],
					exportType: 'named',
					namedExport: componentName,
				},
				{ componentName }
			);

			// Remove any existing default export from SVGR output and append our own
			const codeWithoutDefault = componentCode.replace(/^export default .*;$/m, '');
			const finalCode =
				codeWithoutDefault +
				`\nexport default ${JSON.stringify(dataUrl)};\n`;

			return { contents: finalCode, loader: 'jsx' };
		});
	},
};

const outdir = 'dist-esbuild';

// Копируем public/ в dist-esbuild/ (index.html, фавикон и т.д.)
if (fs.existsSync(outdir)) {
	fs.rmSync(outdir, { recursive: true });
}
fs.cpSync('public', outdir, { recursive: true });

const start = Date.now();

esbuild
	.build({
		entryPoints: ['src/index.tsx'],
		outdir,
		bundle: true,
		format: 'esm',
		splitting: true,
		minify: true,
		sourcemap: false,
		target: ['es2020'],
		loader: {
			'.png': 'file',
			'.jpg': 'file',
			'.jpeg': 'file',
			'.gif': 'file',
			'.webp': 'file',
			'.woff': 'file',
			'.woff2': 'file',
			'.ttf': 'file',
			'.eot': 'file',
		},
		define: {
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
			'process.env.API_URL': JSON.stringify(process.env.API_URL || ''),
		},
		alias: {
			app: path.resolve(__dirname, 'src/1-app'),
			pages: path.resolve(__dirname, 'src/2-pages'),
			widgets: path.resolve(__dirname, 'src/3-widgets'),
			features: path.resolve(__dirname, 'src/4-features'),
			shared: path.resolve(__dirname, 'src/5-shared'),
		},
		plugins: [
			cssModulesPlugin({ pattern: '[hash]_[local]' }),
			svgrPlugin,
		],
	})
	.then(() => {
		const elapsed = ((Date.now() - start) / 1000).toFixed(2);
		const distSize = getDirSize(outdir);
		console.log(`esbuild: done in ${elapsed}s, dist size ${(distSize / 1024 / 1024).toFixed(2)} MB`);
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});

function getDirSize(dir) {
	let total = 0;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			total += getDirSize(full);
		} else {
			total += fs.statSync(full).size;
		}
	}
	return total;
}
