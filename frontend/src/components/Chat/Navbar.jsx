import { useState, useEffect } from 'react'
import { 
    Button,
    ButtonGroup,
    Container, 
    Flex,
    HStack, 
    IconButton, 
    Drawer, 
    CloseButton, 
    Stack,
    VStack,
    Portal, 
    Image,
    useBreakpointValue,
    useDisclosure,
} from '@chakra-ui/react'
import { useQuery } from "@tanstack/react-query"
import { Link } from '@tanstack/react-router'
import { LuAlignLeft } from 'react-icons/lu'
import { BsPencilSquare, BsSearch } from "react-icons/bs"
import Logo from "/rmi_logo_horitzontal_no_tagline.svg"

import { Tooltip } from "@/components/ui/tooltip"
import { Sidebar } from './Sidebar'
import CollapsibleSidebar from "@/components/Chat/CollapsibleSidebar"
import { SidebarContent as ChatSidebarContent } from "@/components/Chat/SidebarContent"
import { SidebarFooter } from "@/components/Common/SidebarFooter"

import { Route } from '@/routes/_chat-layout/chat-session'
import { ChatTab } from './ChatTab'
import { SidebarChatList } from './SidebarChatList'

import { ChatService } from './mocks/chatService'

/**
 * 
 * Sidebar in mobile view.
 * 
 */
// props: ContainerProps (import from chakra-ui)
export const Navbar = (props) => {

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
                                        Conversations ({chats?.length})
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
                                    <SidebarChatList 
                                        data={chats}
                                        isPending={isPending}
                                        error={error} 
                                    />
                                </Drawer.Body>

                                <Drawer.Footer>
                                    <Flex p={4}>
                                        <SidebarFooter />
                                    </Flex>
                                </Drawer.Footer>

                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>

                    
                </Drawer.Root>

                {/* middle element of Navbar */}
                <Image src={Logo} alt="RMI Logo" w="100px" maxW="2xs" />

                {/* right element of Navbar */}
                <Tooltip showArrow content="New Chat">
                    <IconButton 
                        variant="ghost"
                        aria-label="New Chat"
                        color="black"
                    >
                        <BsPencilSquare />
                    </IconButton>
                </Tooltip>
                


            </HStack>
        </Container>
    )
}