import { Search } from 'shared/ui/Search/ui/Search';
import { useProductsSearch } from '../hooks/useProductsSearch';

export const SearchFeature = () => {
	const { searchValue, handleChange, handleClear } = useProductsSearch();
	return <Search value={searchValue} onChange={handleChange} onClear={handleClear} />;
};
