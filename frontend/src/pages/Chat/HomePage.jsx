import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { v4 as uuidv4 } from 'uuid'

import { ContentLayout } from '@/layouts/Chat/ContentLayout'
import { PredefinedPrompts } from '@/components/Chat/contentmain/PredefinedPrompts'
import { ChatService } from '@/components/Chat/mocks/chatService'
import { useCustomToast } from '@/hooks/useCustomToast'
import { handleError } from '@/utils'

// in case you need to roll back, refer to components/Chat/Content.jsx
const HomePage = () => {
    const [newMessage, setNewMessage] = useState('')
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { showErrorToast } = useCustomToast()

    const addChatSession = useMutation({
        mutationFn: (data) => ChatService.addConversation(data),
        onSuccess: (_, variables) => {
            navigate({
                to: '/chat/$chatId',
                params: {
                    chatId: variables.id
                }
            })
        },
        onError: (err) => {
            handleError(err, showErrorToast)
        },
        onSettled: () => {
            // Always refetch conversations after mutation
            queryClient.invalidateQueries({ queryKey: ["userChats"] })
        },
    })
    
    const handlePromptSelect = (promptText) => {
        // Generate new conversation ID
        const newChatId = uuidv4()

        addChatSession.mutate({
            id: newChatId,
            initialPrompt: promptText
        })
    }

    const submitNewMessage = async () => {
        const trimmedMessage = newMessage.trim()
        if (!trimmedMessage) return

        // Generate new conversation ID
        const newChatId = uuidv4()

        addChatSession.mutate({
            id: newChatId,
            initialPrompt: trimmedMessage
        })
    }


    return (
        <ContentLayout
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            submitNewMessage={submitNewMessage}
            isLoading={addChatSession.isPending}
        >
            <PredefinedPrompts onPromptSelect={handlePromptSelect} />
        </ContentLayout>
    )

}

export default HomePage