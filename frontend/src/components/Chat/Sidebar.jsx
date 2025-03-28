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
import { group, messages } from './fakedata'

export const Sidebar = (props) => {

    console.log("Route.to:", Route.to)


    const { isPending, error, data: chats } = useQuery({
        queryKey: ["userChats"],
        // TODO: Replace with actual API call to backend
        queryFn: () => new Promise((resolve) => {
            // Simulate API delay
            setTimeout(() => {
                resolve(messages)
            }, 1000)
        }),
    })

    const ChatList =() => (
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
                        Conversations ({messages.length})
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