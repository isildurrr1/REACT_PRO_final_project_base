import { ChangeEvent } from 'react';

interface SortOption {
	title: string;
	value: Sort;
}

type SortProps = {
	value: Sort;
	options: SortOption[];
	onChange: (newSort: Sort) => void;
};

export const Sort = ({ value, options, onChange }: SortProps) => {
	const handleSortSelect = (e: ChangeEvent<HTMLSelectElement>) => {
		onChange(e.target.value as Sort);
	};
	return (
		<select value={value} onChange={handleSortSelect}>
			{options.map((p) => (
				<option key={p.title} value={p.value}>
					{p.title}
				</option>
			))}
		</select>
	);
};
