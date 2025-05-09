import { useState } from 'react'

function useChat() {
    const [messages, setMessages] = useState([])

    const [isTyping, setIsTyping] = useState(false)

    const handleSend = async (message) => {
        // create a new message object
        const newMessage = {
            message: message,
            sender: 'user',
            direction: 'outgoing',
        }

        // update the messages state
        const newMessages = [...messages, newMessage]
        setMessages(newMessages)

        setIsTyping(true)

        await sendMessageToAI(newMessages)
    }

    const sendMessageToAI = async (messages) => {
        // chatMessages { sender: "user" or "chatgpt", message: "message content is here" }
        // apiMessages { role: "user" or "assistant", content: "message content is here" } - ChatGPT API call acceptable type

        let apiMessages = messages.map((messageObject) => {
            let role = messageObject.sender === 'user' ? 'user' : 'assistant'
            return { role: role, content: messageObject.message }
        })

        // TODO: DELETE when backend is ready and OpenAPI is configured
        const response = await fetch('http://localhost:8001/chat', {
            
        })
    }
}