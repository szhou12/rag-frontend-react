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
            _hover={{
                bg: 'colorPalette.subtle',
                color: 'colorPalette.fg',
            }}
            rounded="md"
        >

            <Stack spacing="0" fontSize="sm" flex="1" width="100%">
                <HStack spacing="1">
                    <Text fontWeight="medium" flex="1" truncate>
                        {message}
                    </Text>

                    
                    <Text color="fg.subtle" fontSize="xs" flexShrink="0">
                        {updatedAt}
                    </Text>
                </HStack>
            </Stack>

            
            
        </HStack>
    )
}