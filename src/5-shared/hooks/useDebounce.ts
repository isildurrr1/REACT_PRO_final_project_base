import { useEffect, useState } from 'react';

export const useDebounce = <V>(outerValue: V, ms: number) => {
	const [optimizedValue, setOptimizedValue] = useState<V>(outerValue);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOptimizedValue(outerValue);
		}, ms);

		return () => clearTimeout(timeoutId);
	}, [ms, outerValue]);

	return optimizedValue;
};
