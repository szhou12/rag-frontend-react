import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box, Button, Card, Flex, Heading, Stack } from "@chakra-ui/react"

// Create a query client
const queryClient = new QueryClient()

// const Demo = () => {
// 	return (
// 		<Box p={8} minH="100vh" bg="ui.light">
// 			<Stack spacing={8} maxW="800px" mx="auto">
// 				<Heading>Chakra UI v3 Theme Test</Heading>
				
// 				<Card p={6}>
// 					<Heading size="md" mb={4}>Button Variants</Heading>
					// <Flex gap={4} wrap="wrap">
					// 	<Button variant="primary">Primary</Button>
					// 	<Button variant="danger">Danger</Button>
					// 	<Button variant="dashed">Dashed</Button>
					// 	<Button variant="text">Text</Button>
					// 	<Button variant="ghost">Ghost</Button>
					// </Flex>
// 				</Card>
				
// 				<Card p={6}>
// 					<Heading size="md" mb={4}>Color Tokens</Heading>
					// <Flex gap={4} wrap="wrap">
					// 	<Box p={4} bg="ui.main" color="white">ui.main</Box>
					// 	<Box p={4} bg="ui.secondary" color="ui.dark">ui.secondary</Box>
					// 	<Box p={4} bg="ui.success" color="white">ui.success</Box>
					// 	<Box p={4} bg="ui.danger" color="white">ui.danger</Box>
					// 	<Box p={4} bg="ui.darkSlate" color="white">ui.darkSlate</Box>
					// 	<Box p={4} bg="ui.dim" color="white">ui.dim</Box>
					// </Flex>
// 				</Card>
// 			</Stack>
// 		</Box>
// 	)
// }


const Demo = () => {
	return (
		<Flex gap={4} wrap="wrap">
		<Box p={4} bg="ui.main" color="white">ui.main</Box>
		<Box p={4} bg="ui.secondary" color="ui.dark">ui.secondary</Box>
		<Box p={4} bg="ui.success" color="white">ui.success</Box>
		<Box p={4} bg="ui.danger" color="white">ui.danger</Box>
		<Box p={4} bg="ui.darkSlate" color="white">ui.darkSlate</Box>
		<Box p={4} bg="ui.dim" color="white">ui.dim</Box>
	</Flex>
	)
  }

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Demo />
		</QueryClientProvider>
	)
}

export default App;
