
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

    const queryClient = useQueryClient()
    const initialPrompt = queryClient.getQueryData(['chat', chatId, 'initialPrompt'])

    // Load initial conversation if chatId exists
    useEffect(() => {
        // Only run if we have an initialPrompt and messages is empty
        if (chatId && initialPrompt && !(messages[0]?.content === initialPrompt)) {
          const loadInitialConversation = async () => {
            // Same logic as before:
            setMessages(draft => [
              ...draft,
              {role: 'user', content: initialPrompt},
              {role: 'assistant', content: '', sources: [], loading: true}
            ]);
            setNewMessage('');
            try {
              const response = await ChatService.sendChatMessage(chatId, initialPrompt)
              for await (const textChunk of parseSSEStream(response)) {
                setMessages(draft => {
                  draft[draft.length - 1].content += textChunk
                });
              }
              setMessages(draft => {
                draft[draft.length - 1].loading = false
              });
            } catch (error) {
              handleError(error, showErrorToast)
              setMessages(draft => {
                draft[draft.length - 1].loading = false
                draft[draft.length - 1].error = true
              });
            }
          };
          loadInitialConversation();
        }
      }, [chatId, initialPrompt]);
      

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