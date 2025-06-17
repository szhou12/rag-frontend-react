import { useState } from 'react'
import {
    Box,
    Container,
    Center,
    Flex,
    Heading,
    Span,
    Stack,
    Text,
} from '@chakra-ui/react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'

import { ThreeLayerLayout } from '@/layouts/Chat/ThreeLayerLayout'
import { ContentLayout } from '@/layouts/Chat/ContentLayout'
import { PredefinedPrompts } from '@/components/Chat/contentmain/PredefinedPrompts'
import { ChatInput } from '@/components/Chat/contentbottom/ChatInput'
import { ChatService } from '@/components/Chat/mocks/chatService'
import useCustomToast from '@/hooks/useCustomToast'
import { handleError } from '@/utils'

// in case you need to roll back, refer to components/Chat/Content.jsx
const HomePage = () => {
    const [newMessage, setNewMessage] = useState('') // visual changes in textarea
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { showErrorToast } = useCustomToast()

    const addChatSession = useMutation({
        mutationFn: (data) => ChatService.addConversation(data),
        // variables = data passed to mutate()
        onSuccess: (_, variables) => {

            queryClient.setQueryData(['chat', variables.id, 'initialPrompt'], variables.initialPrompt)

            navigate({
                to: '/chat/$chatId',
                params: { chatId: variables.id },
            })
        },
        onError: (err) => {
            handleError(err, showErrorToast)
        },
        // onSettled: () => {
        //     // Always refetch conversations after mutation
        //     queryClient.invalidateQueries({ queryKey: ["userChats"] })
        // },
    })

    // New mutation for creating conversation with backend-generated ID
    const createConversation = useMutation({
        mutationFn: (initialMessage) => ChatService.createConversation({initialMessage}),
        onSuccess: (response) => {
            // Backend returns { conversationId }
            navigate({
                to: '/chat/$chatId',
                params: { chatId: response.conversationId }
            })
        },
        onError: (err) => {
            handleError(err, showErrorToast)
        }
    })

    
    const handlePromptSelect = (promptText) => {
        createConversation.mutate(promptText)
    }

    const submitNewMessage = async () => {
        const trimmedMessage = newMessage.trim()
        if (!trimmedMessage) return

        createConversation.mutate(trimmedMessage)
    }


    return (
        <ThreeLayerLayout
            main={
                <Container maxW="4xl">
                    <Stack gap="8">
                        <Heading size="4xl" fontWeight="normal">
                            <Span color="colorPalette.fg">Hello, Client</Span> <br />
                            <Span color="fg.muted">How can I help you today?</Span>
                        </Heading>
                        <PredefinedPrompts onPromptSelect={handlePromptSelect} />
                    </Stack>
                </Container>
            }
            bottom={
                <>
                    <ChatInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        submitNewMessage={submitNewMessage}
                        isLoading={createConversation.isPending}
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

export default HomePage