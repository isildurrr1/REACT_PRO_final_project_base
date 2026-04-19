import { Sort } from 'shared/ui/Sort/ui/Sort';
import { useSort } from '../hooks/useSort';

export const SortFeature = () => {
	const { sort, setSort, sortOptions } = useSort();
	return <Sort value={sort} options={sortOptions} onChange={setSort} />;
};
