import { ChangeEvent, useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useDebounce } from 'shared/hooks/useDebounce';
import { useAppDispatch } from 'shared/store/utils';
import { productsActions } from 'shared/store/slices/products';

const QUERY_SEARCH_PHRASE = 'q';

export const useProductsSearch = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const [searchParams, setSearchParams] = useSearchParams();
	const [searchValue, setSearchValue] = useState(
		() => searchParams.get(QUERY_SEARCH_PHRASE) ?? ''
	);

	const optimizedValue = useDebounce(searchValue, 500);

	useEffect(() => {
		dispatch(productsActions.setSearchText(optimizedValue));
		if (optimizedValue && location.pathname !== '/') {
			navigate('/');
		}
	}, [optimizedValue, dispatch, navigate, location.pathname]);

	useEffect(() => {
		if (searchValue) {
			searchParams.set(QUERY_SEARCH_PHRASE, searchValue);
		} else {
			searchParams.delete(QUERY_SEARCH_PHRASE);
		}
		setSearchParams(searchParams);
	}, [searchParams, searchValue, setSearchParams]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleClear = () => {
		setSearchValue('');
	};

	return { searchValue, handleChange, handleClear };
};
