import { useState, useEffect } from 'react'
import {
    Box,
    Container,
    Flex,
    Heading,
    Span,
    Stack,
} from '@chakra-ui/react'
import { useMatchRoute, useNavigate } from '@tanstack/react-router'
import { useImmer } from 'use-immer'
import { parseSSEStream } from '@/utils'

import { PredefinedPrompts } from '@/features/Chat/PredefinedPrompts'
import { ChatFooter } from '@/features/Chat/ChatFooter'
import ChatInput from '@/features/Chat/ChatInput'
import ChatMessages from '@/features/Chat/ChatMessages'
import { ChatService } from '@/components/Chat/mocks/chatService'


// Act as both index page and chat session
// As index page: 
// case 1: type in Textarea -> new ID -> enters a new chat session
// case 2: select a prompt -> new ID -> enters a new chat session
// case 3: click on a chat tab on sidebar -> load existing ID, load existing messages -> enter the chat session
export default function Chatbot() {
    const [messages, setMessages] = useImmer([])
    const [newMessage, setNewMessage] = useState('')

    const isLoading = messages.length && messages[messages.length - 1].loading

    // UPDATE: const [chatId, setChatId] = useState(null)
    // Get chatId from URL if it exists
    const navigate = useNavigate()
    const matchRoute = useMatchRoute()

    // Get chatId from pending route (will navigate to)
    const params = matchRoute({ 
        to: '/c/$chatId',
        pending: true
    })
    
    // Get chatId if we're on the chat.$chatId route, otherwise null
    const urlChatId = params?.chatId ?? null

    // TODO: Load existing chat data when URL has chatId
    // load history to messages[]
    useEffect(() => {
        if (urlChatId) {
            // loadChatData(urlChatId)
            console.log("A chat session chatId: ", urlChatId)
        }
    }, [urlChatId])

    /**
     * Handles every time user submits a new message
     * 
     * - Adds the user's message and a loading assistant placeholder to UI.
     * - Creates a new chat session if one does not exist.
     * - Sends the message to the backend and streams the assistant's reply via SSE.
     * - Updates the assistant message in real time and handles completion or error.
     */
    async function submitNewMessage() {
        const trimmedMessage = newMessage.trim()
        if (!trimmedMessage || isLoading) return

        setMessages(draft => [...draft,
            {role: 'user', content: trimmedMessage},
            {role: 'assistant', content: '', sources: [], loading: true}
        ])
        // sources[]: document references holder

        // Clear the input field after the user sends a message
        setNewMessage('')

        try {
            let currentChatId = urlChatId
            
            // If no chatId in URL, create new chat
            if (!currentChatId) {
                const { id } = await ChatService.createChat()
                currentChatId = id
                // Update URL with new chatId
                navigate({ 
                    to: '/c/$chatId',
                    params: { chatId: id }
                })
            }

            const response = await ChatService.sendChatMessage(currentChatId, trimmedMessage)
            for await (const textChunk of parseSSEStream(response)) {
                setMessages(draft => {
                    draft[draft.length - 1].content += textChunk
                })
            }
            setMessages(draft => {
                draft[draft.length - 1].loading = false
            })
        } catch (error) {
            console.error(error)
            setMessages(draft => {
                draft[draft.length - 1].loading = false
                draft[draft.length - 1].error = true
            })
        }
    }

    return (
        <Flex
            direction="column"
            flex="1"
            height="100%" // Use height 100% to fill parent instead of 100vh
            width="100%" // Ensure full width
            overflow="hidden" // Prevent overall scrolling so footer fixed at bottom
        >

            <Box 
                flex="1" 
                overflow="auto" // enable scrolling for this box only
                pt={{ base: "8", md: "12" }}  // Account for navbar height
                pb={{ base: "8", md: "12" }}  // Account for navbar height
            >
                {messages.length === 0 ? (
                    <Container maxW="4xl">
                        <Stack gap="8">
                            <Heading size="4xl" fontWeight="normal">
                                <Span color="colorPalette.fg">Hello, Client</Span> <br />
                                <Span color="fg.muted">How can I help you today?</Span>
                            </Heading>

                            <PredefinedPrompts
                                // onPromptSelect={handlePromptSelect}
                            />

                        </Stack>
                    </Container>
                ) : (
                    <ChatMessages 
                        messages={messages}
                        isLoading={isLoading}
                    />
                )}

            </Box>

            <Box flex="0" width="100%">
                
                {/* <ChatTextarea
                    isNewChat={true}
                    onNewChat={handlePromptSelect}
                /> */}

                <ChatInput
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    submitNewMessage={submitNewMessage}
                    isLoading={isLoading}
                />

                <ChatFooter />
            </Box>

        </Flex>
    )

}