import { 
    Box,
    Flex,
    HStack, 
    Stack, 
    Text,
} from '@chakra-ui/react'

export const ChatTab = (props) => {
    const {name, image, updated_at, title } = props.data

    return (
        <HStack
            align="flex-start"
            // gap="3"
            px="2"
            py="2"
            _hover={{
                bg: 'colorPalette.subtle',
                color: 'colorPalette.fg',
            }}
            rounded="md"
            bg="blue.500"
        >

            {/* <Stack spacing="0" fontSize="sm" flex="1" width="100%">
                <HStack spacing="1">
                    <Text fontWeight="medium" flex="1" truncate>
                        {title}
                    </Text>

                </HStack>
            </Stack> */}

            

            <Flex w="full">
                <Text fontWeight="medium" truncate>
                    {title}
                </Text>
            </Flex>

            
            
        </HStack>
    )
}