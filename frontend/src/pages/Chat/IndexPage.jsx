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

import { ChatService } from '@/components/Chat/Sidebar'


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