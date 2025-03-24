import { Flex } from "@chakra-ui/react"
import { Outlet } from "@tanstack/react-router"

import { Navbar as ChatNavbar } from "@/components/Chat/Navbar"
import { Sidebar as ChatSidebar } from "@/components/Chat/Sidebar"

export const ChatPageLayout = () => {
    return (
        <Flex direction="column" h="100vh">
            
            <ChatNavbar hideFrom="md" /> {/* hides when screen size > md */}

            <Flex flex="1" overflow="hidden">

                <ChatSidebar hideBelow="md" /> {/* hides when screen size < md */}

                <Flex flex="1" direction="column" p={4} overflowY="auto">
                    <Outlet /> {/* render the child route component */}
                </Flex>

            </Flex>
            
        </Flex>
    )
}