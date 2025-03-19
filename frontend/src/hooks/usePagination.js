import { useNavigate } from "@tanstack/react-router"

/**
 * Hook for handling pagination in routes that use pageSearchSchema (admin.js, scraper.js, uploader.js)
 * 
 * @param {Object} options
 * @param {string} options.from - Route path to navigate from
 * @returns {Object} Pagination helpers
 * 
 * Set new page number in the URL
 * User clicks page 2
 *     ↓
 * onPageChange({ page: 2 }) triggered in Pagination component
 *     ↓
 * setPage(2)
 *     ↓
 * navigate({ search: (prev) => ({ ...prev, page: 2 }) })
 *     ↓
 * URL updates to: /admin?page=2
 */
export function usePagination({ from }) {
    const navigate = useNavigate({ from })
    
    const setPage = (page) => {
        navigate({
            search: (prev) => ({ ...prev, page }),
        })
    }

    return {
        setPage,
        // Could add more pagination helpers here
        // setPerPage: (perPage) => navigate({ search: (prev) => ({ ...prev, perPage }) }),
        // setSortBy: (sortBy) => navigate({ search: (prev) => ({ ...prev, sortBy }) }),
    }
}