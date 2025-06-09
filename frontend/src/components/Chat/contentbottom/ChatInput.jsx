import {
    Container,
    Flex,
    HStack,
    IconButton,
    Textarea,
} from '@chakra-ui/react'
import { LuImagePlus, LuMic, LuSendHorizontal } from 'react-icons/lu'


// TODO: little problem - won't be able to send same message again, need to edit to resume
export const ChatInput = ({ newMessage, isLoading, setNewMessage, submitNewMessage }) => {

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
                bg="bg.muted" 
                borderRadius="l2" 
                px="4" 
                py="3" 
                align="flex-start"
                boxShadow="lg"
            >
                <Textarea
                    value={newMessage} // text displayed in textarea
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoresize // auto-increase height to maxH
                    maxH="120px" // max height textarea can grow to
                    unstyled
                    outline="none"
                    bg="transparent"
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
                        onClick={submitNewMessage}
                        isDisabled={!newMessage.trim()}
                        aria-label="Send message"
                    >
                        <LuSendHorizontal />
                        
                    </IconButton>
                </HStack>
                
            </Flex>
        </Container>
    )
    
}
