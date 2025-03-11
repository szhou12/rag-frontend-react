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

// Create a query client to handle data received from the backend
const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: handleApiError,
	}),
	mutationCache: new MutationCache({
		onError: handleApiError,
	}),
})



function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}

export default App;
