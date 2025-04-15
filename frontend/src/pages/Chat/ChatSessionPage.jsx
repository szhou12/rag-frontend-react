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
import { ChatMessages } from '@/components/Chat/ChatMessages'
import { ChatMessage } from '@/components/Chat/ChatMessage'
import { Route } from '@/routes/_chat-layout/chat-session'

import { chats } from '@/components/Chat/fakedata'

const users = {
    user: {
        name: 'MaryJane',
        image: 'https://api.dicebear.com/9.x/thumbs/svg?seed=MaryJane'
    },
    assistant: {
        name: 'AI',
        image: 'https://api.dicebear.com/9.x/thumbs/svg?seed=AI'
    },
}

export default function ChatSessionPage() {

    const chatId = Route.useParams().chatId

    console.log("A chat session chatId: ", chatId)

    // TODO
    const handleSendMessage = (message) => {
        console.log("Sending a new message: ", message)
    }

    const Conversation = ({data}) => {
        return (
            <ChatMessages>
                {data.map((chat, index) => (
                    <ChatMessage
                        key={index}
                        author={users[chat.type]}
                        messages={chat.messages}
                    />
                ))}
            </ChatMessages>
        )
    }


    return (
        <Flex
            direction="column"
            flex="1"
            height="100%" // Use height 100% to fill parent instead of 100vh
            width="100%" // Ensure full width
            overflow="hidden" // Prevent overall scrolling
        >

            <Box 
                flex="1" 
                overflow="auto"
                pt={{ base: "8", md: "12" }}  // Account for navbar height
                pb={{ base: "8", md: "12" }}  // Account for navbar height
            >
                <Conversation data={chats} />
            </Box>

            <Box flex="0" width="100%">
                <ChatTextarea
                    isNewChat={false}
                    onSendMessage={handleSendMessage}
                />

                <ChatFooter />
            </Box>

        </Flex>
    )
}