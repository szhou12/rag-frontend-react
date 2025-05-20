import { useState } from 'react'
import {
    Container,
    Flex,
    HStack,
    IconButton,
    Textarea,
} from '@chakra-ui/react'
import { LuImagePlus, LuMic, LuSendHorizontal } from 'react-icons/lu'

import useAutoSize from "@/hooks/useAutoSize"

function ChatInput({ newMessage, isLoading, setNewMessage, submitNewMessage }) {
    const textareaRef = useAutoSize(newMessage)

    // Press Enter -> Send message
    // Press Shift + Enter -> New line
    // Can't send message while loading
    function handleKeyDown(e) {
        if (e.keyCode === 13 && !e.shiftKey && !isLoading) {
            e.preventDefault() // Prevents the default Enter key behavior (which would add a new line)
            submitNewMessage()
        }
    }

    return (
        <Container maxW="4xl">
            <Flex 
                // as="form"
                // onSubmit={handleSubmit}
                bg="bg.muted" 
                borderRadius="l2" 
                px="4" 
                py="3" 
                align="flex-start"
                boxShadow="lg"
            >
                <Textarea
                    ref={textareaRef} // auto-adjust size of area
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    unstyled
                    outline="none"
                    bg="transparent"
                    resize="none"
                    width="full"
                    maxH="140px" // max height textarea can grow to
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
                        onClick={submitNewMessage}
                        isDisabled={!newMessage.trim()}
                        aria-label="Send message"
                        // type="submit"
                    >
                        <LuSendHorizontal />
                        
                    </IconButton>
                </HStack>
                
            </Flex>
        </Container>
    )
    
}

export default ChatInput