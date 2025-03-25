import {
    Box,
    Container,
    Flex,
    Heading,
    Span,
    Stack,
} from '@chakra-ui/react'
import { PredefinedPrompts } from '@/features/Chat/PredefinedPrompts'
import { ChatTextarea } from '@/features/Chat/ChatTextarea'
import { ChatFooter } from '@/features/Chat/ChatFooter'

export default function IndexPage() {

    const Header = () => (
        <Heading size="4xl" fontWeight="normal">
            <Span color="colorPalette.fg">Hello, Client</Span> <br />
            <Span color="fg.muted">How can I help you today?</Span>
        </Heading>
    )


    return (
        <Flex
            direction="column"
            height="100vh"
        >

            <Box 
                flex="1" 
                overflow="auto"
                pt={{ base: "16", md: "20" }}  // Account for navbar height
                pb={{ base: "24", md: "32" }}  // Account for navbar height
            >
                <Container maxW="4xl">
                    <Stack gap="10">
                        <Header />
                        <PredefinedPrompts />
                    </Stack>
                </Container>
            </Box>

            <Box flex="0">
                <ChatTextarea />

                <ChatFooter />
            </Box>

        </Flex>
    )
}