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
 * @returns 
 */
export const ChatTextarea = () => {

    return (
        <Container maxW="4xl">
            <Flex bg="bg.muted" borderRadius="l2" px="4" py="3" align="flex-start">
                <Textarea
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


                    <IconButton aria-label="Send message">
                        {/* TODO */}
                        <Link to="/chat/conversation">
                            <LuSendHorizontal />
                        </Link>
                        
                    </IconButton>
                </HStack>
                
            </Flex>
        </Container>
        
    )
}