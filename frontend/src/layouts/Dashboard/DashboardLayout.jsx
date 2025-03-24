import { Flex } from "@chakra-ui/react"
import { Outlet } from "@tanstack/react-router"

import { Navbar as DashboardNavbar } from "@/components/Dashboard/Navbar"
import { Sidebar as DashboardSidebar } from "@/components/Dashboard/Sidebar"

export const DashboardLayout = () => {
    return (
        <Flex direction="column" h="100vh">
            
            <DashboardNavbar hideFrom="md" /> {/* hides when screen size > md */}

            <Flex flex="1" overflow="hidden">

                <DashboardSidebar hideBelow="md" /> {/* hides when screen size < md */}

                <Flex flex="1" direction="column" p={4} overflowY="auto">
                    <Outlet /> {/* render the child route component: IndexPage, ScraperPage, UploaderPage, AdminPage */}
                </Flex>

            </Flex>
            
        </Flex>
    )
}
