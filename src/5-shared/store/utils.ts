import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from './types';

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
