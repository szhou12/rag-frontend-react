import { 
    Box,
    Stack,
    Text,
    Flex,
    StackSeparator,
    Spinner,
    VStack,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { BsChatTextFill, BsMicFill, BsPaperclip, BsPinAngleFill } from 'react-icons/bs'
import { ChatTab } from './ChatTab'
import { SearchField } from '../Common/SearchField'
import { ChatGroupHeader } from './ChatGroupHeader'
import { SidebarFooter } from '../Common/SidebarFooter'
import { Route } from '@/routes/_chat-layout/chat-session'
import { v4 as uuidv4 } from 'uuid'

const MOCK_CONVERSATIONS = Array.from({ length: 7 }, (_, index) => ({
    id: uuidv4(),
    name: `user${index + 1}`,
    updated_at: new Date(2024, 0, index + 1).toLocaleDateString(),
    title: `This is conversation ${index + 1}`,
}));

// TODO: DELETE when backend is ready and Data Delegate Model is implemented
export const ChatService = {
    getConversations: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...MOCK_CONVERSATIONS])
            }, 1000)
        })
    },

    addConversation: (newConversation) => {
        return new Promise((resolve) => {
            // Create new conversation object with all required fields
            const conversation = {
                id: newConversation.id,
                name: "You",
                updated_at: new Date().toLocaleDateString(), // Current date
                title: newConversation.initialPrompt
            }

            // Add to start of array
            MOCK_CONVERSATIONS.unshift(conversation)

            // Return a copy of the updated array
            resolve([...MOCK_CONVERSATIONS])
        })
    }
}


export const Sidebar = (props) => {

    const { data: chats, isPending, error } = useQuery({
        queryFn: () => ChatService.getConversations(),
        queryKey: ["userChats"],
    })

    const ChatList = () => (
        <Stack mt="2" spacing="4" flex="1" overflowY="auto" px="5" pb="5">
            <Stack mt="2" spacing="4">

                <ChatGroupHeader icon={BsChatTextFill}>history</ChatGroupHeader>

                <Stack spacing="0" mx="-4">
                    {isPending ? (
                        <VStack colorPalette="teal">
                            <Spinner 
                                color="colorPalette.600"
                                css={{ "--spinner-track-color": "colors.gray.200" }}
                                size="lg"
                            />
                            <Text color="colorPalette.600">Loading...</Text>
                        </VStack>
                    ) : error ? (
                        <Text px="4" color="red.500">Something went wrong!</Text>
                    ) : (
                        chats?.map((message) => (
                            <Link 
                                key={message.id} 
                                to={Route.to}
                                params={{ chatId: message.id }}
                                style={{ 
                                    textDecoration: 'none',
                                    display: 'block'
                                }}
                            >
                                <ChatTab data={message} />
                            </Link>
                        ))
                    )}
                </Stack>
            </Stack>

        </Stack>
    )



    return (
        <Stack
            flex="1"
            height="100%"
            p={{ base: '4', md: '6' }}
            bg="bg.panel"
            borderRightWidth="1px"
            justifyContent="space-between"
            maxW="xs"
            {...props}
        >
            <Stack flex="1" overflow="hidden">
                <Box px="5">
                    <Text fontSize="lg" fontWeight="medium">
                        Conversations ({chats?.length})
                    </Text>
                </Box>

                <Flex px="4">
                    <SearchField />
                </Flex>

                <ChatList />
            </Stack>
            
            <SidebarFooter />
        </Stack>
    )
}