import { Flex } from "@chakra-ui/react"
import { Outlet } from "@tanstack/react-router"

import { Navbar } from "@/components/Dashboard/Navbar"
import { Sidebar } from "@/components/Dashboard/Sidebar"

function DashboardLayout() {
    return (
        <Flex direction="column" h="100vh">
            <Navbar hideFrom="md" />
            <Flex flex="1" overflow="hidden">
                <Sidebar hideBelow="md" />
                <Flex flex="1" direction="column" p={4} overflowY="auto">
                    <Outlet />
                </Flex>
            </Flex>
            
        </Flex>
    )
}

export default DashboardLayout