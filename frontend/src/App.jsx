import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider } from '@tanstack/react-router'
import { router } from "@/routes/router"

// Create a query client to handle data received from the backend
const queryClient = new QueryClient()



function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	)
}

export default App;
