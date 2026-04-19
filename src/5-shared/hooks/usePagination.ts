import { useState } from 'react';

export const usePagination = <T>(data: T[], itemsPerPage: number) => {
	const [currentPage, setCurrentPage] = useState<number>(1);
	const countPages = Math.ceil(data.length / itemsPerPage);
	const MIN_PAGE = 1;

	function getCurrentData() {
		const start = (currentPage - 1) * itemsPerPage;
		const end = start + itemsPerPage;
		return data.slice(start, end);
	}

	function nextPage() {
		setCurrentPage((currentPage) => Math.min(currentPage + 1, countPages));
	}

	function prevPage() {
		setCurrentPage((currentPage) => Math.max(currentPage - 1, MIN_PAGE));
	}

	function setPagePaginated(page: number) {
		const pageNumber = Math.max(MIN_PAGE, page);
		setCurrentPage(() => Math.min(pageNumber, countPages));
	}

	return {
		getCurrentData,
		countPages,
		currentPage,
		nextPage,
		prevPage,
		setPagePaginated,
	};
};
