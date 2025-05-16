import { useState, useEffect } from 'react'
import { useMatchRoute, useNavigate } from '@tanstack/react-router'

import { useImmer } from 'use-immer'

function Chatbot() {
    // Get chatId from URL if it exists
    const navigate = useNavigate()
    const matchRoute = useMatchRoute()

    // Get chatId from pending route (will navigate to)
    const params = matchRoute({ 
        to: '/chat/$chatId',
        pending: true
    })
    
    // Get chatId if we're on the chat.$chatId route, otherwise null
    const urlChatId = params?.chatId ?? null

    const [messages, setMessages] = useImmer([])
    const [newMessage, setNewMessage] = useState('')

    const isLoading = messages.length && messages[messages.length - 1].loading

    // TODO: Load existing chat data when URL has chatId
    useEffect(() => {
        if (urlChatId) {
            loadChatData(urlChatId)
        }
    }, [urlChatId])

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
                const { id } = await api.createChat()
                currentChatId = id
                // Update URL with new chatId
                navigate({ 
                    to: '/chat/$chatId',
                    params: { chatId: id }
                })
            }

            const response = await api.sendChatMessage(currentChatId, trimmedMessage)
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

    return ()

}