import { 
	MutationCache,
	QueryCache,
	QueryClient, 
	QueryClientProvider 
} from "@tanstack/react-query"
import { RouterProvider } from '@tanstack/react-router'
import { router } from "@/routes/router"


// MOCK API error handler
const handleApiError = (error) => {
	console.error("API Error:", error);
	// You could add toast notifications here if needed
}

// Create global in-memory cache in user's browser
const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: handleApiError,
	}),
	mutationCache: new MutationCache({
		onError: handleApiError,
	}),
})


// QueryClientProvider allows all React components to access this global cache by useQuery() or useQueryClient()
function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}

export default App;
