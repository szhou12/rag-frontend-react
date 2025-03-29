import {
    Box,
    Container,
    Flex,
    Heading,
    Span,
    Stack,
} from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'
import { PredefinedPrompts } from '@/features/Chat/PredefinedPrompts'
import { ChatTextarea } from '@/features/Chat/ChatTextarea'
import { ChatFooter } from '@/features/Chat/ChatFooter'


/**
 * TODO:
 *  1. click a predefined promppt -> generate a new conversation (UUID4) -> sidebar adds this new conversation -> present dialog in the center & URL redirects to /c/<uuid>
 *  2. user type in textarea -> generate a new conversation (UUID4) -> sidebar adds this new conversation -> present dialog in the center & URL redirects to /c/<uuid>
 */
export default function IndexPage() {

    const Header = () => (
        <Heading size="4xl" fontWeight="normal">
            <Span color="colorPalette.fg">Hello, Client</Span> <br />
            <Span color="fg.muted">How can I help you today?</Span>
        </Heading>
    )

    const handlePromptSelect = (promptText) => {
        // Generate new conversation ID
        const newChatId = uuidv4()
        
        // Log both for verification
        console.log("New conversation:", {
            id: newChatId,
            initialPrompt: promptText
        })

        // We'll add navigation here in next step
    }


    return (
        <Flex
            direction="column"
            height="100vh"
            overflow="hidden" // disable scrolling so footer fixed at bottom
        >

            <Box 
                flex="1" 
                overflow="overflow" // enable scrolling for this box only
                pt={{ base: "16", md: "20" }}  // Account for navbar height
                pb={{ base: "24", md: "32" }}  // Account for navbar height
            >
                <Container maxW="4xl">
                    <Stack gap="10">
                        <Header />

                        <PredefinedPrompts
                            onPromptSelect={handlePromptSelect}
                        />
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