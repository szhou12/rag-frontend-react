import {
    Box,
    Container,
    Flex,
    Heading,
    Span,
    Stack,
} from '@chakra-ui/react'
import { ChatMessages } from '@/components/Chat/ChatMessages'
import { ChatMessage } from '@/components/Chat/ChatMessage'
import { PredefinedPrompts } from '@/features/Chat/PredefinedPrompts'

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

export const ChatInterface = ({ isNewChat }) => {

    if (isNewChat) {

        return (
            <Box 
                flex="1" 
                overflow="overflow" // enable scrolling for this box only
                pt={{ base: "16", md: "20" }}  // Account for navbar height
                pb={{ base: "24", md: "32" }}  // Account for navbar height
            >
                <Container maxW="4xl">
                    <Stack gap="10">
                        <Heading size="4xl" fontWeight="normal">
                            <Span color="colorPalette.fg">Hello, Client</Span> <br />
                            <Span color="fg.muted">How can I help you today?</Span>
                        </Heading>

                        <PredefinedPrompts />
                    </Stack>
                </Container>
            </Box>
        )
    }

    // TODO: fetch chat messages

    // compose fetched chat messages
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
        <Box 
            flex="1" 
            overflow="auto"
            pt={{ base: "16", md: "20" }}
            pb={{ base: "24", md: "32" }}
        >
            <Conversation data={chats} />
        </Box>
    )
}