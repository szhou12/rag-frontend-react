
import { useState, useEffect } from 'react'
import { useMatchRoute, useParams } from '@tanstack/react-router'
import { useImmer } from 'use-immer'
import { Box, Center, Text } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'

import { ThreeLayerLayout } from '@/layouts/Chat/ThreeLayerLayout'
import { ChatMessages } from '@/components/Chat/contentmain/ChatMessages'
import { ChatInput } from '@/components/Chat/contentbottom/ChatInput'
import { ChatService } from '@/components/Chat/mocks/chatService'
import { parseSSEStream } from '@/utils'
import useCustomToast from '@/hooks/useCustomToast'
import { handleError } from '@/utils'

const ConversationPage = () => {

    const [messages, setMessages] = useImmer([])
    const [newMessage, setNewMessage] = useState('')
    const { showErrorToast } = useCustomToast()

    // Get chatId from URL if it exists
    const matchRoute = useMatchRoute()
    // Get chatId from pending route (will navigate to)
    const params = matchRoute({ 
        to: '/chat/$chatId',
        pending: true
    })
    // Get chatId if we're on the chat.$chatId route, otherwise null
    const chatId = params?.chatId ?? null


    const isLoading = messages.length && messages[messages.length - 1].loading

    // const queryClient = useQueryClient()
    // const initialPrompt = queryClient.getQueryData(['chat', chatId, 'initialPrompt'])

    // Load initial conversation if chatId exists
    useEffect(() => {
        // Only run if we have an initialPrompt and messages is empty
        if (chatId) {
			const loadConversation = async () => {
				try {
					// Fetch conversation from database
					const conversation = await ChatService.getConversation(chatId)
					// Convert backend messages to frontend format
					const frontendMessages = conversation.messages.map(message => ({
						...message,
						loading: false,
						error: false
					}))

					setMessages(frontendMessages)

					// Check if conversation needs AI response
					if (conversation.status === 'pending') {
						// Find the last user message that needs a response
						const lastUserMessage = conversation.messages
							.filter(msg => msg.role === 'user') // filter for all user messages
							.pop() // get the last user message

						if (lastUserMessage) {
							// Add loading assistant message
							setMessages(draft => [...draft, {
								role: 'assistant',
								content: '',
								sources: [],
								timestamp: new Date(),
								loading: true,
								error: false
							}])
	
							// Get AI response
							await getAIResponse(lastUserMessage.content)
						}
					}

				} catch (error) {
					handleError(error, showErrorToast)
				}
			}

			loadConversation();
        }
    }, [chatId]);
	
	// Extract AI response logic to reusable function
    const getAIResponse = async (messageContent) => {
        try {
            const response = await ChatService.sendChatMessage(chatId, messageContent)
            for await (const textChunk of parseSSEStream(response)) {
                setMessages(draft => {
                    draft[draft.length - 1].content += textChunk
                })
            }
            setMessages(draft => {
                draft[draft.length - 1].loading = false
            })
        } catch (error) {
            handleError(error, showErrorToast)
            setMessages(draft => {
                draft[draft.length - 1].loading = false
                draft[draft.length - 1].error = true
            })
        }
    }


      

    const submitNewMessage = async () => {
        const trimmedMessage = newMessage.trim()
        if (!trimmedMessage || isLoading) return

        setMessages(draft => [...draft,
            {role: 'user', content: trimmedMessage},
            {role: 'assistant', content: '', sources: [], loading: true}
        ])

        setNewMessage('')

        try {
            const response = await ChatService.sendChatMessage(chatId, trimmedMessage)
            for await (const textChunk of parseSSEStream(response)) {
                setMessages(draft => {
                    draft[draft.length - 1].content += textChunk
                })
            }
            setMessages(draft => {
                draft[draft.length - 1].loading = false
            })
        } catch (error) {
            handleError(error, showErrorToast)
            setMessages(draft => {
                draft[draft.length - 1].loading = false
                draft[draft.length - 1].error = true
            })
        }
    }

    return (
        <ThreeLayerLayout
            main={
                <ChatMessages
                    messages={messages}
                    isLoading={isLoading}
                />
            }
            bottom={
                <>
                    <ChatInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        submitNewMessage={submitNewMessage}
                        isLoading={isLoading}
                    />
                    <Center height="7" bg="bg.panel">
                        <Text textStyle="xs" color="fg.subtle" textAlign="center">
                            Our AI model can make mistakes. Be sure to check important info.
                        </Text>
                    </Center>
                </>
            }
            bottomProps={{borderTopWidth:"1px", p: 2}}
        />
    )
}

export default ConversationPage