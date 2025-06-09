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

import { Route } from '@/routes/_chat-layout/chat-session'
import { ChatTab } from './ChatTab'
import { SearchField } from '../Common/SearchField'
import { ChatGroupHeader } from './ChatGroupHeader'
import { SidebarFooter as SidebarFooterOld } from "@/components/Common/SidebarFooter"
import { SidebarIcons as SidebarIconsOld } from "./SidebarIcons"
import { ChatService } from './mocks/chatService'
import { ThreeLayerLayout } from '@/components/Common/ThreeLayerLayout'
import { SidebarIcons } from '@/components/Chat/sidebartop/SidebarIcons'
import { SidebarFooter } from '@/components/Chat/sidebarbottom/SidebarFooter'
import { SidebarContent } from '@/components/Chat/sidebarcontent/SidebarContent'

const SidebarChakraPro = (props) => {

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
                
                <SidebarFooterOld />
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

const CollapsibleSidebar = ({ 
    initialSize = "large",
    smallWidth = "60px",
    largeWidth = "280px",
    bg = "transparent",
    children,
    ...props
}) => {
    const [sidebarSize, setSidebarSize] = useState(initialSize)

    const toggleSidebar = () => {
        setSidebarSize(sidebarSize === "small" ? "large" : "small");
    }

    return (
        <Flex
            direction="column"
            transition="width 0.1s ease-in-out"
            width={sidebarSize === "small" ? smallWidth : largeWidth}
            bg={bg}
            borderRightWidth="1px"
            minH="100vh"
            justify="space-between"
            {...props}
        >
            {/* Desktop View Only */}
            <SidebarIconsOld 
                isCollapsed={sidebarSize === "small"}
                onToggleSidebar={toggleSidebar}
                hideBelow="md"
            />

            {/* Sidebar Content */}
            {sidebarSize === "large" && (
                <Flex direction="column" flex="1" overflow="hidden">
                    {children}
                </Flex>
            )}

            {/* Footer */}
            <Flex p={sidebarSize === "small" ? "2" : "4"}>
                <SidebarFooterOld isCollapsed={sidebarSize === "small"} />
            </Flex>
            
        </Flex>
    )

}


const SidebarThreeLayer = ({user, ...props}) => {
    const [sidebarSize, setSidebarSize] = useState("large")



    const toggleSidebar = () => {
        setSidebarSize(sidebarSize === "small" ? "large" : "small");
    }

    return (
        <Stack
            flex="1"
            // p={{ base: '4', md: '6' }}
            bg="transparent"
            borderRightWidth="1px"
            justifyContent="space-between"
            maxW="xs"
            overflow="hidden"
            {...props}
        >
            <ThreeLayerLayout
                top={
                    <SidebarIcons 
                        user={user}
                        isCollapsed={sidebarSize === "small"} 
                        onToggleSidebar={toggleSidebar} 
                    />
                }
                topProps={{bg: 'pink.500'}}
                main={
                    <>
                        {sidebarSize === "large" && <SidebarContent />}
                    </>
                }
                mainProps={{bg: 'blue.500'}}
                bottom={
                    <SidebarFooter user={user} isCollapsed={sidebarSize === "small"} />
                }
                bottomProps={{bg: 'green.500', borderTopWidth:"1px", p:4}}
            />
        </Stack>
    )
}

export { 
    SidebarChakraPro,
    CollapsibleSidebar,
    SidebarThreeLayer,
}