import {
    Box,
    Stack,
    StackSeparator,
} from "@chakra-ui/react"

export const ChatMessages = (props) => {
    return (
        <Stack
            maxW="4xl" // Maximum width preset
            mx="auto" // Margin left & right set to 'auto' - centers the stack horizontally
            w="full" // Full width of the container
            paddingX={{ base: '4', md: '8'}} // Responsive horizontal padding
            separator={ // Divider between messages
                // <Box marginLeft="14!"> 
                //     <StackSeparator />
                // </Box>
                <Box marginLeft="14!">
                    <StackSeparator />
                </Box>
                
            }
            spacing="10"
            {...props}
        />
    )
}