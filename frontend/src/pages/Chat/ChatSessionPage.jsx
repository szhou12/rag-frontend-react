import { useEffect, useRef, useState } from 'react'
import {
    Box,
    Container,
    Flex,
    Heading,
    Span,
    Stack,
} from '@chakra-ui/react'
import { useParams, useNavigate } from '@tanstack/react-router'

import { ChatTextarea } from '@/features/Chat/ChatTextarea'
import { ChatFooter } from '@/features/Chat/ChatFooter'
import { ChatMessages } from '@/components/Chat/ChatMessages'
import { ChatMessage } from '@/components/Chat/ChatMessage'
import { Route } from '@/routes/_chat-layout/chat-session'

import { chats } from '@/components/Chat/fakedata'
import { useChat } from '@/components/Chat/mocks/ChatContext'

const users = {
    user: {
        name: 'MaryJane',
        image: 'https://api.dicebear.com/9.x/thumbs/svg?seed=MaryJane'
    },
    assistant: {
        name: 'AI',
        image: 'https://api.dicebear.com/9.x/thumbs/svg?seed=AI'
    },
}

const Conversation = ({data}) => {
    return (
        <ChatMessages>
            {data.map((chat, index) => (
                <ChatMessage
                    key={index}
                    author={users[chat.type]}
                    messages={chat.content}
                />
            ))}
        </ChatMessages>
    )
}

export default function ChatSessionPage() {

    const chatId = Route.useParams().chatId

    console.log("A chat session chatId: ", chatId)

    // TODO
    const handleSendMessage = (message) => {
        console.log("Sending a new message: ", message)
    }

    // const Conversation = ({data}) => {
    //     return (
    //         <ChatMessages>
    //             {data.map((chat, index) => (
    //                 <ChatMessage
    //                     key={index}
    //                     author={users[chat.type]}
    //                     messages={chat.messages}
    //                 />
    //             ))}
    //         </ChatMessages>
    //     )
    // }

    /**
     * ChatConversation.jsx
     */
    const navigate = useNavigate()
    const { 
        conversations,
        handleNewMessage, 
        isLoading 
    } = useChat()

    // get current conversation
    const curConversation = conversations[chatId]
    if (!curConversation) {
        console.log("No conversation found for chatId: ", chatId)
        navigate({ to: "/chat" })
        return null
    }
    // const { 
    //     conversations, 
    //     currentConversation,
    //     handleFirstMessage,
    //     handleNewMessage,
    //     isLoading,
    // } = useChat()
    // const curConversation = conversations[chatId]
    // // Check if conversation exists
    // if (!currentConversation) {
    //     console.log("No conversation found for chatId: ", chatId)
        
    //     // Create a new conversation with a default message
    //     const createNewConversation = async () => {
    //         try {
    //             const newChatId = await handleFirstMessage("Hello! How can I help you today?")
    //             // Navigate to the new conversation
    //             navigate({ to: `/c/${newChatId}` })
    //         } catch (error) {
    //             console.error("Failed to create new conversation:", error)
    //             // If creation fails, redirect to chat home
    //             navigate({ to: "/chat" })
    //         }
    //     }

    //     // Call the function immediately
    //     createNewConversation()
    //     return <div>Creating new conversation...</div>
    // }



    // Effect: Detect if the textarea has any text content
    const [hasTextContent, setHasTextContent] = useState(false)
    const handleTextareaChange = (event) => {
        setHasTextContent(event.target.value.trim().length > 0)
    }

    const textareaRef = useRef(null)

    const handleMsgSubmit = async (event) => {
        event.preventDefault()
        const message = textareaRef.current?.value

        if (!message?.trim()) return

        try {
            await handleNewMessage(message, chatId)
        } catch (error) {
            // TODO: may use toast to show error message
            console.error('Error submitting message:', error)
        }

        event.currentTarget.reset()
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
        setHasTextContent(false)
    }

    // Effect: Scroll to the bottom of the chat when messages change
    const messagesEndRef = useRef(null)

    useEffect(() => {
        // if messsages changed, wait for 0.1s before scrolling to the bottom
        const timeoutId = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',    // Ensures alignment to the bottom
                inline: 'nearest'
            })
        }, 100)

        return () => clearTimeout(timeoutId)
    }, [curConversation.messages]) // effect triggers when messages changes



    return (
        <Flex
            direction="column"
            flex="1"
            height="100%" // Use height 100% to fill parent instead of 100vh
            width="100%" // Ensure full width
            overflow="hidden" // Prevent overall scrolling
        >

            <Box 
                flex="1" 
                overflowY="auto" // Enable vertical scrolling
                pt={{ base: "8", md: "12" }}  // Account for navbar height
                pb={{ base: "8", md: "12" }}  // Account for navbar height
            >
                {/* <Conversation data={chats} /> */}
                {/* <Conversation data={curConversation.messages} /> */}
                <ChatMessages>
                    {curConversation.messages.map((message, index) => (
                        <ChatMessage
                            key={index}
                            author={users[message.type]}
                            messages={message.content}
                        />
                    ))}
                    {isLoading && (
                        <ChatMessage
                            key="loading-message"
                            author={users.assistant}
                            messages={[""]}  // Placeholder text
                            isLoading={true}   // Show loading spinner
                        />
                    )}
                    {/* Scroll target */}
                    <Box 
                        ref={messagesEndRef} 
                        paddingBottom="40" // make padding part of the target to ensure both the target AND its padding are visible
                        height="1px"
                        width="100%"
                    />
                </ChatMessages>
            </Box>

            <Box flex="0" width="100%">
                <ChatTextarea
                    isNewChat={false}
                    // onSendMessage={handleSendMessage}
                    onSendMessage={handleMsgSubmit}
                />

                <ChatFooter />
            </Box>

        </Flex>
    )
}