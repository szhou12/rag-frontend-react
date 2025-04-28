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
import { Sidebar } from './Sidebar'
import CollapsibleSidebar from "@/components/Chat/CollapsibleSidebar"
import { SidebarContent as ChatSidebarContent } from "@/components/Chat/SidebarContent"
import { SidebarFooter } from "@/components/Common/SidebarFooter"

import { Route } from '@/routes/_chat-layout/chat-session'
import { ChatTab } from './ChatTab'

import { ChatService } from './SidebarContent'

/**
 * 
 * Sidebar in mobile view.
 * 
 */
// props: ContainerProps (import from chakra-ui)
export const Navbar = (props) => {

    const [isOpen, setIsOpen] = useState(false)

    // // Add a useEffect to close drawer when switching to desktop
    // useEffect(() => {
    //     const handleResize = () => {
    //         if (window.innerWidth >= 768) { // md breakpoint
    //             setIsOpen(false)
    //         }
    //     }
        
    //     window.addEventListener('resize', handleResize)
    //     return () => window.removeEventListener('resize', handleResize)
    // }, [])

    // const { isOpen, onOpen, onClose } = useDisclosure()
    const isMobile = useBreakpointValue({ base: true, md: false })

    // Auto-close drawer when switching to desktop
    useEffect(() => {
        if (!isMobile && isOpen) {
            // onClose();
            console.log("closing drawer")
            setIsOpen(false)
            // onClose()
        }
    }, [isMobile, isOpen])

    const { data: chats, isPending, error } = useQuery({
        queryFn: () => ChatService.getConversations(),
        queryKey: ["userChats"],
    })

    const ChatList = () => (
        <Stack mt="2" spacing="4" flex="1" overflowY="auto" px="5" pb="5">
            <Stack mt="2" spacing="4">
                {/* <ChatGroupHeader icon={BsChatTextFill}>history</ChatGroupHeader> */}
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
        <Container py="2.5" background="bg.panel" borderBottomWidth="1px" {...props}>
            <HStack justify="space-between">

                {/* left element of Navbar */}
                <Drawer.Root 
                    placement="start"
                    isOpen={isOpen}
                    onOpenChange={setIsOpen}
                >
                    <Drawer.Trigger asChild>
                        <IconButton 
                            variant="ghost"
                            aria-label="Open Menu"
                            color="black"
                        >
                            <LuAlignLeft />
                        </IconButton>
                    </Drawer.Trigger>

                    {/* <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content>
                                <Drawer.CloseTrigger asChild>
                                    <CloseButton 
                                        size="sm" 
                                        colorPalette="gray" 
                                        position='absolute'
                                        top='2'
                                        right='2'
                                    />
                                </Drawer.CloseTrigger>

                                <Sidebar />
                                <CollapsibleSidebar>
                                    <ChatSidebarContent />
                                </CollapsibleSidebar>

                                <Flex direction="column" flex="1" overflow="hidden">
                                    {children}
                                </Flex>

                                <Flex p={4}>
                                    <SidebarFooter />
                                </Flex>


                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal> */}

                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content>

                                <Drawer.Header>
                                    
                                    <Drawer.Title flex="1">Conversations ({chats?.length})</Drawer.Title>
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
                                    {/* <Flex direction="column" overflow="hidden">
                                        {children}
                                    </Flex> */}
                                    <ChatList />
                                </Drawer.Body>
                                {/* <Flex
                                    direction="column"
                                    borderRightWidth="1px"
                                    minH="0"
                                    justify="space-between"
                                >
                                    <Flex direction="column" flex="1" overflow="hidden">
                                        {children}
                                    </Flex>

                                </Flex> */}

                                <Drawer.Footer>
                                    <Flex p={4}>
                                        <SidebarFooter />
                                    </Flex>
                                </Drawer.Footer>

                                {/* <Drawer.CloseTrigger asChild>
                                    <CloseButton size="sm" colorPalette="gray" />
                                </Drawer.CloseTrigger> */}

                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>

                    
                </Drawer.Root>

                {/* middle element of Navbar */}
                <Image src={Logo} alt="RMI Logo" w="100px" maxW="2xs" />

                {/* right element of Navbar */}
                <IconButton 
                    variant="ghost"
                    aria-label="New Chat"
                    color="black"
                >
                    <BsPencilSquare />
                </IconButton>


            </HStack>
        </Container>
    )
}