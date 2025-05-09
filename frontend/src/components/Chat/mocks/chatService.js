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
    }
}