import { useState } from 'react'
import { 
    Button,
    ButtonGroup,
    Container, 
    Flex,
    HStack, 
    IconButton, 
    Drawer, 
    CloseButton, 
    Portal, 
    Image,
} from '@chakra-ui/react'
import { useQuery } from "@tanstack/react-query"
import { Link } from '@tanstack/react-router'
import { LuAlignLeft, LuLayoutDashboard } from 'react-icons/lu'
import { BsPencilSquare, BsSearch } from "react-icons/bs"
import { Tooltip } from "@/components/ui/tooltip"
import Logo from "/rmi_logo_horitzontal_no_tagline.svg"

// import { Sidebar } from './Sidebar'
// import CollapsibleSidebar from "@/components/Chat/CollapsibleSidebar"
// import { SidebarContent as ChatSidebarContent } from "@/components/Chat/SidebarContent"
// import { SidebarFooter } from "@/components/Common/SidebarFooter"
// import { ChatTab } from './ChatTab'
// import { SidebarChatList } from './SidebarChatList'

import { Route } from '@/routes/_chat-layout/chat-session'
import { SidebarFooter } from '@/components/Chat/sidebarbottom/SidebarFooter'
import { TabList } from '@/components/Chat/sidebarmain/TabList'
import { ChatService } from './mocks/chatService'

/**
 * 
 * Sidebar in mobile view.
 * 
 */
// props: ContainerProps (import from chakra-ui)
export const Navbar = ({user, ...props}) => {

    const [isOpen, setIsOpen] = useState(false)

    // const isMobile = useBreakpointValue({ base: true, md: false })

    const { data: chats, isPending, error } = useQuery({
        queryFn: () => ChatService.getConversations(),
        queryKey: ["userChats"],
    })
  

    return (
        <Container py="2.5" background="bg.panel" borderBottomWidth="1px" {...props}>
            <HStack justify="space-between">

                {/* left element of Navbar */}
                <Drawer.Root 
                    placement="start"
                    isOpen={isOpen}
                    onOpenChange={(e) => setIsOpen(e.open)}
                >
                    <Tooltip showArrow content="Open Sidebar">
                        <Drawer.Trigger asChild>
                            <IconButton 
                                variant="ghost"
                                aria-label="Open Menu"
                                color="black"
                            >
                                <LuAlignLeft />
                            </IconButton>
                        </Drawer.Trigger>
                    </Tooltip>

                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content>

                                <Drawer.Header>
                                    <Drawer.Title flex="1">
                                        Conversations
                                    </Drawer.Title>

                                    <ButtonGroup>
                                        <IconButton variant="ghost" color="black">
                                            <BsSearch />
                                        </IconButton>
                                    </ButtonGroup>

                                    <Drawer.CloseTrigger asChild pos="initial">
                                        <CloseButton variant="ghost" color="black" />
                                    </Drawer.CloseTrigger>
                                </Drawer.Header>

                                <Drawer.Body>
                                    <TabList 
                                        data={chats}
                                        isPending={isPending}
                                        error={error} 
                                        w="full"
                                    />
                                </Drawer.Body>

                                <Drawer.Footer>
                                    <Flex p={4}>
                                        <SidebarFooter user={user} w="full"/>
                                    </Flex>
                                </Drawer.Footer>

                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>

                    
                </Drawer.Root>

                {/* middle element of Navbar */}
                <Image src={Logo} alt="RMI Logo" w="100px" maxW="2xs" />

                {/* right element of Navbar */}
                <HStack justify="space-between" >
                    <Tooltip showArrow content="New Chat">
                        <IconButton 
                            variant="ghost"
                            aria-label="New Chat"
                            color="black"
                        >
                            <BsPencilSquare />
                        </IconButton>
                    </Tooltip>

                    {user?.role !== "client" && (
                        <Tooltip showArrow content="Staff Dashboard">
                            <IconButton 
                                variant="ghost"
                                aria-label="Dashboard"
                                color="black"
                            >
                                <LuLayoutDashboard />
                            </IconButton>
                        </Tooltip>
                    )}

                </HStack>

            </HStack>
        </Container>
    )
}