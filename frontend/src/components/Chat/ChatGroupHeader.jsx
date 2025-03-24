import { 
    HStack, 
    Icon, 
    Text,
} from '@chakra-ui/react'

export const ChatGroupHeader = (props) => {
    const { icon, children } = props

    return (
        <HStack>
            <Icon as={icon} />
            <Text fontWeight="semibold" textTransform="uppercase" fontSize="xs">
                {children}
            </Text>
        </HStack>
    )
}