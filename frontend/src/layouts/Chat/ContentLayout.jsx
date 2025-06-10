import { 
    Center, 
    Text
} from '@chakra-ui/react'

import { ThreeLayerLayout } from '@/layouts/Chat/ThreeLayerLayout'
import { ChatInput } from '@/components/Chat/contentbottom/ChatInput'

export const ContentLayout = ({
    children,
    newMessage,
    setNewMessage,
    submitNewMessage, 
    isLoading
}) => {
    return (
        <ThreeLayerLayout
            main={children}
            // mainProps={{bg: 'blue.500'}}
            bottom={
                <>
                    <ChatInput
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        submitNewMessage={submitNewMessage}
                        isLoading={isLoading}
                    />
                    <Center height="7" bg="bg.panel">
                        <Text textStyle="xs" color="fg.subtle" textAlign="center">
                            Our AI model can make mistakes. Be sure to check important info.
                        </Text>
                    </Center>
                </>
            }
            bottomProps={{borderTopWidth:"1px", p: 2}}
        />
    )
}