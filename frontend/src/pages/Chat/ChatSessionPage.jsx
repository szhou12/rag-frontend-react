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
            height="100vh"
            overflow="hidden"
        >

            <Box 
                flex="1" 
                overflow="auto"
                pt={{ base: "16", md: "20" }}  // Account for navbar height
                pb={{ base: "24", md: "32" }}  // Account for navbar height
            >
                <Conversation data={chats} />
            </Box>

            <Box
                flex="0"
            >
                <ChatTextarea />

                <ChatFooter />
            </Box>

        </Flex>
    )
}