import { createContext, useContext, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'  // For generating conversation IDs

// Create the context
const ChatContext = createContext()

// action types
const ACTIONS = {
    START_CHAT: 'START_CHAT',
    ADD_MESSAGE: 'ADD_MESSAGE',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    SET_CURRENT_CONVERSATION: 'SET_CURRENT_CONVERSATION',
}

// initial state to handle multiple conversations
const initialState = {
    conversations: {},  // Store conversations by ID
    currentConversationId: null,
    isLoading: false,
    error: null,
}

const chatReducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.START_CHAT: {
            const { message, conversationId } = action.payload
            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    [conversationId]: {
                        id: conversationId,
                        messages: [{
                            type: 'user',
                            content: message,
                            timestamp: new Date().toISOString(),
                        }]
                    }
                },
                currentConversationId: conversationId,
            }
        }

        case ACTIONS.ADD_MESSAGE: {
            const { conversationId, type, content } = action.payload
            const conversation = state.conversations[conversationId]

            if (!conversation) return state

            return {
                ...state,
                conversations: {
                    ...state.conversations,
                    [conversationId]: {
                        ...conversation,
                        messages: [...conversation.messages, {
                            type,
                            content,
                            timestamp: new Date().toISOString(),
                        }],
                    }
                }
            }
        }

        case ACTIONS.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload,
            }

        case ACTIONS.SET_ERROR:
            return {
                ...state,
                error: action.payload, 
            }

        case ACTIONS.SET_CURRENT_CONVERSATION:
            return {
                ...state,
                currentConversationId: action.payload,
            }
        
        default:
            return state
    }
}

// Context Provider
export const ChatProvider = ({ children }) => {
    const [state, dispatch] = useReducer(chatReducer, initialState)

    const handleFirstMessage = async (message) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true })

            // Generate new conversation ID
            // shoudl we generate at frontend?
            const conversationId = uuidv4()

            // Start new conversation
            dispatch({ 
                type: ACTIONS.START_CHAT, 
                payload: { message, conversationId } 
            })

            // Simulate API call to backend
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Add AI response
            dispatch({
                type: ACTIONS.ADD_MESSAGE,
                payload: {
                    conversationId,
                    type: 'assistant',
                    content: `Hello! I'm your AI assistant. I'll help you with: ${message}`
                }
            })

            return conversationId  // Return ID for navigation

        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
            throw error  // Re-throw for error handling in ChatStartPage
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false })
        }
    }

    const handleNewMessage = async (message, conversationId) => {
        try {
            dispatch({ type: ACTIONS.SET_LOADING, payload: true })

            // Add user message
            dispatch({
                type: ACTIONS.ADD_MESSAGE,
                payload: { 
                    conversationId,
                    type: 'user',
                    content: message
                }
            })

            // Simulate API call to backend
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Add AI response
            dispatch({
                type: ACTIONS.ADD_MESSAGE,
                payload: {
                    conversationId,
                    type: 'assistant',
                    content: `Thank you for your message. You said: ${message}`
                }
            })
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message })
            throw error  // Re-throw for error handling in ChatConversation
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false })
        }
    }

    // Helper to get current conversation
    const getCurrentConversation = () => {
        return state.currentConversationId 
            ? state.conversations[state.currentConversationId]
            : null
    }

    return (
        <ChatContext.Provider value={{
            ...state,
            currentConversation: getCurrentConversation(),
            handleFirstMessage,
            handleNewMessage,
        }}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChat = () => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider')
    }
    return context
}