import { useState, useEffect } from 'react'
import { 
    Box,
    Stack,
    Text,
    Flex,
    StackSeparator,
    Spinner,
    VStack,
    IconButton,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { BsChatTextFill, BsMicFill, BsPaperclip, BsPinAngleFill } from 'react-icons/bs'
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb"
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

    const [isCollapsed, setIsCollapsed] = useState(false)
    
    // useEffect(() => {
    //     const handleResize = () => {
    //         if (window.innerWidth < 768) { // md breakpoint
    //             setIsCollapsed(false)
    //         }
    //     }
        
    //     window.addEventListener('resize', handleResize)
    //     return () => window.removeEventListener('resize', handleResize)
    // }, [])


    return (
        <Box
            // width={{ base: isCollapsed ? "60px" : "280px" }}
            transition="width 0.2s ease-in-out"
            // flexShrink={0}
            position="relative"
            // flex="1"
            minH="0"
            {...props}
        >

            {/* <IconButton
                onClick={() => setIsCollapsed(!isCollapsed)}
                position="absolute"
                right="-30px"
                top="50%"
                transform="translateY(-50%)"
                zIndex={1}
                display={{ base: "none", md: "flex" }} // hide on mobile view
            >
                {isCollapsed ? <TbLayoutSidebarLeftExpand /> : <TbLayoutSidebarLeftCollapse />}
            </IconButton> */}

            {/* Sidebar content */}
            <Stack
                display={isCollapsed ? "none" : "flex"}
                flex="1"
                height="100%"
                p={{ base: '4', md: '6' }}
                bg="bg.panel"
                borderRightWidth="1px"
                justifyContent="space-between"
                maxW="xs"
                // {...props}
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

        </Box>
    )

    // return (
    //     <Flex
    //         direction="column"
    //         transition="width 0.2s ease-in-out"
    //         position="relative"
    //         minH="100vh"  // Ensure it spans full height
    //         width={{ base: isCollapsed ? "60px" : "280px" }}
    //         bg="bg.panel"
    //         borderRightWidth="1px"
    //         {...props}
    //     >
    //         {/* Collapse Button */}
    //         <IconButton
    //             onClick={() => setIsCollapsed(!isCollapsed)}
    //             alignSelf="flex-end"
    //             m="2"
    //             display={{ base: "none", md: "flex" }}
    //         >
    //             {isCollapsed ? <TbLayoutSidebarLeftExpand /> : <TbLayoutSidebarLeftCollapse />}
    //         </IconButton>

            

    //     </Flex>
    // )
}