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

    createChat: async () => {
        const response = await fetch('http://localhost:8001' + '/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const data = await response.json()

        if (!response.ok) {
            return Promise.rejuect({ status: response.status, data })
        }

        return data
    },

    sendChatMessage: async (chatId, message) => {
        const response = await fetch('http://localhost:8001' + `/c/${chatId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })

        if (!response.ok) {
            return Promise.reject({ status: response.status, data: await response.json() })
        }
    
        return response.body
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