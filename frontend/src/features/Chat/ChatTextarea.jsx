import { useState } from 'react'
import {
    Container,
    Flex,
    HStack,
    IconButton,
    Textarea,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { LuImagePlus, LuMic, LuSendHorizontal } from 'react-icons/lu'

/**
 * For users to input text
 * @param {Object} props
 * @param {boolean} props.isNewChat - Whether this textarea is for creating a new chat
 * @param {function} props.onNewChat - Callback for creating a new chat (used in IndexPage)
 * @param {function} props.onSendMessage - Callback for sending message in existing chat (used in ChatSessionPage)
 */
export const ChatTextarea = ({ isNewChat, onNewChat, onSendMessage }) => {
    const [message, setMessage] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!message.trim()) return

        if (isNewChat) {
            // Create new chat session using handlePromptSelect() in IndexPage
            onNewChat?.(message)
        } else {
            // Continue existing conversation
            onSendMessage?.(message)
        }

        setMessage('') // Clear input after sending
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <Container maxW="4xl">
            <Flex 
                as="form"
                onSubmit={handleSubmit}
                bg="bg.muted" 
                borderRadius="l2" 
                px="4" 
                py="3" 
                align="flex-start"
            >
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    unstyled
                    outline="none"
                    bg="transparent"
                    resize="none"
                    width="full"
                    placeholder="Ask me anything about clean energy..."
                />

                <HStack>
                    <IconButton variant="ghost" aria-label="Add image">
                        <LuImagePlus />
                    </IconButton>
                    <IconButton variant="ghost" aria-label="Record audio">
                        <LuMic />
                    </IconButton>


                    <IconButton 
                        aria-label="Send message"
                        type="submit"
                        isDisabled={!message.trim()}
                    >
                        {/* <Link to="/chat/conversation">
                            <LuSendHorizontal />
                        </Link> */}
                        <LuSendHorizontal />
                        
                    </IconButton>
                </HStack>
                
            </Flex>
        </Container>
        
    )
}