import { useState, useEffect } from 'react'
import { 
    Box, 
    Center,
    Text,
    Flex,
    Textarea,
} from '@chakra-ui/react'
import { useImmer } from 'use-immer'
import { parseSSEStream } from '@/utils'

import { ThreeLayerLayout } from '@/components/Common/ThreeLayerLayout'
import { ChatInput } from './contentbottom/ChatInput'
import { ChatMessages } from './contentmain/ChatMessages'
import { PredefinedPrompts } from './contentmain/PredefinedPrompts'
import { ChatService } from './mocks/chatService'

const Content = () => {

    const [messages, setMessages] = useImmer([])
    const [newMessage, setNewMessage] = useState('')

    const isLoading = messages.length && messages[messages.length - 1].loading

    const urlChatId = null

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
                // navigate({ 
                //     to: '/c/$chatId',
                //     params: { chatId: id }
                // })
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

    function handlePromptSelect(prompt) {
        setNewMessage(prompt)
        submitNewMessage()
    }


    return (
        <ThreeLayerLayout
            main={
                <>
                    {messages.length === 0 ? (
                        <PredefinedPrompts onPromptSelect={handlePromptSelect} />
                    ) : (
                        <ChatMessages
                            messages={messages}
                            isLoading={isLoading}
                        />
                    )}
                </>
            }
            mainProps={{bg: 'blue.500'}}
            bottom={
                <>
                    <ChatInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        submitNewMessage={submitNewMessage}
                        isLoading={isLoading}
                    />

                    <Center height="7" bg="currentBg">
                        <Text textStyle="xs" color="fg.subtle" textAlign="center">
                            Our AI model can make mistakes. Be sure to check important info.
                        </Text>
                    </Center>
                </>
                
            }
            bottomProps={{bg: 'green.500', borderTopWidth:"1px", p: 2}}
        />
    )
}

export { Content }