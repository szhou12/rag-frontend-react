import { Flex } from "@chakra-ui/react"
import { Outlet } from "@tanstack/react-router"

import { Navbar } from "@/components/Dashboard/Navbar"
import { Sidebar } from "@/components/Dashboard/Sidebar"

export const DashboardLayout = () => {
    return (
        <Flex direction="column" h="100vh">
            
            <Navbar hideFrom="md" /> {/* hides when screen size > md */}

            <Flex flex="1" overflow="hidden">

                <Sidebar hideBelow="md" /> {/* hides when screen size < md */}

                <Flex flex="1" direction="column" p={4} overflowY="auto">
                    <Outlet /> {/* render the child route component: IndexPage, ScraperPage, UploaderPage, AdminPage */}
                </Flex>

            </Flex>
            
        </Flex>
    )
}
