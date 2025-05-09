import { useState, useRef } from 'react'
import {
    Box,
    Container,
    Flex,
    Heading,
    Span,
    Stack,
} from '@chakra-ui/react'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { PredefinedPrompts } from '@/features/Chat/PredefinedPrompts'
import { ChatTextarea } from '@/features/Chat/ChatTextarea'
import { ChatFooter } from '@/features/Chat/ChatFooter'
import { Route } from '@/routes/_chat-layout/chat-session'
import useCustomToast from "@/hooks/useCustomToast"

import { ChatService } from '@/components/Chat/mocks/chatService'
import { useChat } from '@/components/Chat/mocks/chatContext'


/**
 * TODO:
 *  1. click a predefined promppt -> generate a new conversation (UUID4) -> sidebar adds this new conversation -> present dialog in the center & URL redirects to /c/<uuid>
 *  2. user type in textarea -> generate a new conversation (UUID4) -> sidebar adds this new conversation -> present dialog in the center & URL redirects to /c/<uuid>
 */
export default function IndexPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { showErrorToast } = useCustomToast()

    const Header = () => (
        <Heading size="4xl" fontWeight="normal">
            <Span color="colorPalette.fg">Hello, Client</Span> <br />
            <Span color="fg.muted">How can I help you today?</Span>
        </Heading>
    )

    const addChatSession = useMutation({
        mutationFn: (data) => ChatService.addConversation(data),

        onSuccess: (_, variables) => {

            navigate({
                to: Route.to,
                params: {
                    chatId: variables.id
                }
            })
        },

        onError: (err) => {
            handleError(err, showErrorToast)
        },

        onSettled: () => {
            // Always refetch conversations after mutation (success or error)
            queryClient.invalidateQueries({ queryKey: ["userChats"] })
        },
    })


    const handlePromptSelect = (promptText) => {
        // Generate new conversation ID
        const newChatId = uuidv4()
        
        // Log both for verification
        console.log("Add a new chat session:", {
            id: newChatId,
            initialPrompt: promptText
        })

        addChatSession.mutate({
            id: newChatId,
            initialPrompt: promptText
        })
    }

    /**
     * ChatStartPage.jsx
     */
    const { handleFirstMessage, isLoading } = useChat()

    const [hasTextContent, setHasTextContent] = useState(false)
    const textareaRef = useRef(null) // init textareaRef.current to null

    const handleTextareaChange = (event) => {
        setHasTextContent(event.target.value.trim().length > 0)
    }

    const handleMsgSubmit = async (event) => {
        // prevents the following behaviors
        // → Page would reload
        // → URL might become something like "/?message=Hello"
        // → Lost application state
        event.preventDefault()

        const message = textareaRef.current?.value

        // avoid submitting empty messages
        if (!message?.trim()) return

        // handle message submission
        try {
            // Get conversation ID from context
            const conversationId = await handleFirstMessage(message)

            // Navigate to the conversation
            navigate({ 
                to: '/c/$conversationId',
                params: { conversationId }
            })

        } catch (error) {
            // TODO: may use toast to show error message
            console.error('Error submitting message:', error)
        }

        // Clear the entire form
        // event.currentTarget refers to the <form> element
        // reset() is a form method that clears all form inputs
        event.currentTarget.reset()
        // Reset textarea height using ref
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
        // Re-mute button
        setHasTextContent(false)
    }

    // Add handler for PromptSuggestButton clicks
    const handlePromptClick = (description) => {
        if (textareaRef.current) {
            // Sets the textarea value/text to the description
            textareaRef.current.value = description
            
            // Submit form
            // textareaRef.current.form finds the parent form <Box as="form">
            // requestSubmit() triggers onSubmit handler defined in <Box as="form">
            textareaRef.current.form?.requestSubmit()
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
                <Container maxW="4xl">
                    <Stack gap="8">
                        <Header />

                        <PredefinedPrompts
                            onPromptSelect={handlePromptSelect}
                        />
                    </Stack>
                </Container>
            </Box>

            <Box flex="0" width="100%">
                <ChatTextarea
                    isNewChat={true}
                    onNewChat={handlePromptSelect}
                />

                <ChatFooter />
            </Box>

        </Flex>
    )
}