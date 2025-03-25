import {
    Box, 
    HStack, 
    Stack,
    Spinner,
    Text,
} from "@chakra-ui/react"
import { Avatar } from "@/components/ui/avatar"

export const ChatMessage = ({ author, messages = [], isLoading = false }) => {
    return (
        <HStack align="flex-start" gap="5">
            <Box pt="1">
                <Avatar size="sm" src={author.image} name={author.name} />
            </Box>
            <Stack spacing="1">
                <Text fontWeight="medium">{author.name}</Text>
                <Stack spacing="2" position="relative">
                    {messages.map((message, index) => (
                        <Box 
                            key={index}
                            lineHeight="tall"
                            maxW="100%"
                            position="relative"
                        >
                            {isLoading ? (
                                <Spinner 
                                    color="teal.500"
                                    size="lg"
                                    css={{ "--spinner-track-color": "colors.gray.200" }}
                                />
                            ) : (
                                <Text
                                    whiteSpace="pre-wrap"     // Preserve line breaks and wrap text
                                    wordBreak="break-word"    // Break long words if necessary
                                    overflowWrap="break-word" // Ensure long words don't overflow
                                >
                                    {message}
                                </Text>
                            )}
                        </Box>
                    ))}
                </Stack>
            </Stack>
        </HStack>
    )
}