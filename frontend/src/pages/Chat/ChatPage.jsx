// testing redesign
import {
    Box,
    Container,
    Flex,
    Heading,
    Span,
    Stack,
} from '@chakra-ui/react'
import { ChatTextarea } from '@/features/Chat/ChatTextarea'
import { ChatFooter } from '@/features/Chat/ChatFooter'
import { ChatInterface } from '@/features/Chat/ChatInterface'
import { Route as ChatIdImport } from '@/routes/_chat-layout/chat-id'


export default function ChatPage() {

    let chatId
    try {
        // chatId = useParams({ 
        //     from: '/c/$chatId',
        //     select: (params) => params.chatId,
        // })
        chatId = ChatIdImport.useParams().chatId
    } catch {
        chatId = null  // We're on /chat route (new chat)
    }

    const isNewChat = !chatId

    console.log("chatId: ", chatId)
    console.log("isNewChat: ", isNewChat)

    return (
        <Flex
            direction="column"
            height="100vh"
            overflow="hidden" // disable scrolling so footer fixed at bottom
        >
            <ChatInterface 
                isNewChat={isNewChat}
            />

            {/* <Box 
                flex="1" 
                overflow="overflow" // enable scrolling for this box only
                pt={{ base: "16", md: "20" }}  // Account for navbar height
                pb={{ base: "24", md: "32" }}  // Account for navbar height
            >
                <Container maxW="4xl">
                    <Stack gap="10">
                        <Header />
                        <PredefinedPrompts />
                    </Stack>
                </Container>
            </Box> */}

            <Box flex="0">
                <ChatTextarea />
                <ChatFooter />
            </Box>

        </Flex>
    )
}