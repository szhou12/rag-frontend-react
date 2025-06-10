import { Box, Flex, Container, Button, Stack } from "@chakra-ui/react"
import { Outlet, Link } from "@tanstack/react-router"
import { LuLayoutDashboard, LuArrowRight } from "react-icons/lu"

import useAuth from '@/hooks/useAuth'
import { Navbar } from "@/components/Chat/Navbar"
// import { Sidebar as ChatSidebar } from "@/components/Chat/Sidebar"
// import CollapsibleSidebar from "@/components/Chat/CollapsibleSidebar"
// import { SidebarContent as ChatSidebarContent } from "@/components/Chat/SidebarContent"
// import { SidebarFooter } from "@/components/Common/SidebarFooter"
import { SidebarThreeLayer as Sidebar } from "@/components/Chat/Sidebar"


const ChatHeader = ({href}) => {

    return (
        <Flex 
            justify="flex-end" 
            py={1}  // small vertical padding if want some breathing room
            px={2}  // horizontal padding for spacing from edges
        >
            <Button 
                variant="ghost"
                justifyContent="end"
                gap="3"
                color="fg.muted"
                _hover={{
                    bg: 'colorPalette.subtle',
                    color: 'colorPalette.fg',
                }}
                _currentPage={{
                    bg: 'colorPalette.subtle',
                    color: 'colorPalette.fg',
                }}
                asChild
            >
                <Link to={href}>
                    <LuLayoutDashboard /> Dashboard <LuArrowRight />
                </Link>
                
            </Button>
        </Flex>
    )
}

export const ChatPageLayout = () => {
    const { user, isLoadingUser } = useAuth()

    return (
        <Flex direction="column" h="100vh" position="relative" overflow="auto">
            
            {/* mobile only: hides when screen size > md */}
            <Navbar user={user} hideFrom="md" position="sticky" top="0" zIndex="sticky"/>
            

            <Flex
                flex="1" 
                // overflow="hidden"
            >

                {/* Desktop Only: hides when screen size < md */}
                {/* <CollapsibleSidebar hideBelow="md">
                    <ChatSidebarContent />
                </CollapsibleSidebar> */}
                <Flex
                    hideBelow="md" 
                    maxW="xs" 
                    position="sticky" 
                    top="0" 
                    direction="column"
                    height="100vh" 
                    p={1}
                >
                    <Sidebar user={user} />
                </Flex>
                
                {/* <Stack 
                    flex="1" // Stack expands to fill the available space
                    alignItems="stretch" // make all Stack's children to fill the width of the container horizontally
                    minH="0" // allows Stack to shrink to fit the remaining space, preventing overflow
                    // overflow="hidden" // Prevent outer scroll
                >
                    {!isLoadingUser && user?.role !== "client" && (<ChatHeader href="/dashboard/index" />)}

                    <Container 
                        display="flex" 
                        flex="1" // Container expands to fill the available space
                        maxW="100%"
                        p="0" // Remove container padding to prevent overflow
                        // overflow="hidden" // Prevent container scroll
                    >
                        <Outlet />
                    </Container>
                </Stack> */}

                <Flex 
                    flex="1"
                    direction="column"
                    height="100vh"
                    p={1}
                    alignItems="stretch"
                >
                    <Outlet />
                </Flex>

            </Flex>
            
        </Flex>
    )
}