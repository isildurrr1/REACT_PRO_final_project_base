import { useState, ChangeEvent } from 'react';

const MIN_COUNT = 1;
const MAX_COUNT = 99;

export const useCount = () => {
	const [count, setCount] = useState(1);

	const handleCount = (e: ChangeEvent<HTMLInputElement>) => {
		const newCount = +e.target.value;
		const validCount =
			newCount > MAX_COUNT
				? MAX_COUNT
				: newCount < MIN_COUNT
				? MIN_COUNT
				: newCount;
		setCount(validCount);
	};
	const handleCountMinus = () => {
		const newCount = count - 1;
		const validCount = newCount < MIN_COUNT ? MIN_COUNT : newCount;
		setCount(validCount);
	};
	const handleCountPlus = () => {
		const newCount = count + 1;
		const validCount = newCount > MAX_COUNT ? MAX_COUNT : newCount;
		setCount(validCount);
	};
	return { count, handleCount, handleCountMinus, handleCountPlus };
};
