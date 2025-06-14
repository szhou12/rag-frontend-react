// DELETE when backend is ready and OpenAPI is configured

import { v4 as uuidv4 } from 'uuid'

export const MOCK_CONVERSATIONS = Array.from({ length: 7 }, (_, index) => ({
    id: uuidv4(),
    name: `user${index + 1}`,
    updated_at: new Date(2024, 0, index + 1).toLocaleDateString(),
    title: `This is conversation ${index + 1}`,
}))


export const ChatService = {
    getConversations: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...MOCK_CONVERSATIONS])
            }, 1000)
        })
    },

    addConversation: (newConversation) => {
        return new Promise((resolve) => {
            const conversation = {
                id: newConversation.id,
                name: "You",
                updated_at: new Date().toLocaleDateString(),
                title: newConversation.initialPrompt
            }

            MOCK_CONVERSATIONS.unshift(conversation)
            resolve([...MOCK_CONVERSATIONS])
        })
    },

    addChat: async (data) => {
        // This should POST to your backend API
        const response = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                initialMessage: data.initialPrompt
            })
        })
        
        if (!response.ok) throw new Error('Failed to create conversation')
        
        const result = await response.json()
        // Backend returns the new chat ID
        return { id: result.conversationId }
    },

    getChat: async (chatId) => {
        const response = await fetch(`/api/conversations/${chatId}`)
        if (!response.ok) throw new Error('Failed to fetch conversation')
        return response.json() // Returns messages array
    },

    // TDOO: configure backend
    // createChat: async () => {
    //     const response = await fetch('http://localhost:8001' + '/chat', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })

    //     const data = await response.json()

    //     if (!response.ok) {
    //         return Promise.rejuect({ status: response.status, data })
    //     }

    //     return data
    // },

    createChat: () => {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                // Generate a new chat ID
                const newChatId = uuidv4()
                
                // Create a mock response that matches what the backend would return
                const mockResponse = {
                    id: newChatId,
                    messages: [],  // Empty messages array for new chat
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    status: 'active'
                }

                // Add to our mock conversations list
                MOCK_CONVERSATIONS.unshift({
                    id: newChatId,
                    name: "You",
                    updated_at: new Date().toLocaleDateString(),
                    title: "New Chat"
                })

                resolve(mockResponse)
            }, 500) // Simulate 500ms network delay
        })
    },


    // TODO: configure backend
    // sendChatMessage: async (chatId, message) => {
    //     const response = await fetch('http://localhost:8001' + `/c/${chatId}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ message })
    //     })

    //     if (!response.ok) {
    //         return Promise.reject({ status: response.status, data: await response.json() })
    //     }
    
    //     return response.body
    // },
    sendChatMessage: (chatId, message) => {
        // Create a mock response stream
        const encoder = new TextEncoder()
        const stream = new ReadableStream({
            async start(controller) {
                // Simulate streaming response
                // const response = message
                const response = "## Heading\n\nBased on your Chakra package. So [click here](http://chakra-ui.com) to confirm your plan.\n\n- first item\n- second item\n"
                // const chunks = response.split('\n\n')
                const chunks = response.split(/(?<=\n)/)

                for (let i = 0; i < chunks.length; i++) {
                    // Add a small delay between chunks to simulate streaming
                    await new Promise(resolve => setTimeout(resolve, 100))
                    // Send the chunk as SSE data, add space after each word except the last one
                    const chunk = chunks[i] + (i < chunks.length - 1 ? ' ' : '')
                    controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
                }
                controller.close()
            }
        })

        return stream
    },

    // TODO
    loadChatHistory: async (chatId) => {
        const response = await fetch('http://localhost:8001' + `/c/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            return Promise.reject({ status: response.status, data: await response.json() })
        }

        return response.body
    }
}