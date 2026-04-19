import './styles/normalize.css';
import './styles/styles.css';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from 'widgets/Header';
import { SortFeature } from 'features/products';
import { Footer } from 'widgets/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
	const { pathname } = useLocation();

	return (
		<>
			<Header />
			{pathname === '/' && (
				<div className='container content__sort' style={{ marginTop: 24 }}>
					<SortFeature />
				</div>
			)}
			<main className='main'>
				<Outlet />
			</main>
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				pauseOnHover
				theme='colored'
			/>
			<Footer />
		</>
	);
};
