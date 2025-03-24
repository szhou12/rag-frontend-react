import { 
    // Avatar, 
    // AvatarBadge, 
    Box,
    HStack, 
    Stack, 
    Text,
} from '@chakra-ui/react'

export const ChatMessage = (props) => {
    const {name, image, updatedAt, message } = props.data

    return (
        <HStack
            align="flex-start"
            gap="3"
            px="4"
            py="3"
            _hover={{ bg: 'bg.muted' }}
            rounded="md"
        >

            <Stack spacing="0" fontSize="sm" flex="1" isTruncated>
                <HStack spacing="1">
                    <Box isTruncated>
                        <Text fontWeight="medium" flex="1">
                            {message}
                        </Text>
                    </Box>
                    
                    <Text color="fg.subtle" fontSize="xs">
                        {updatedAt}
                    </Text>
                </HStack>
            </Stack>

            
            
        </HStack>
    )
}