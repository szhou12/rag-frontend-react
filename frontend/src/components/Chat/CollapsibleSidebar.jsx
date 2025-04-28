import { useState } from "react"
import { Flex, IconButton } from "@chakra-ui/react"

import { SidebarIcons } from "./SidebarIcons"
import { SidebarFooter } from "@/components/Common/SidebarFooter"

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
            <SidebarIcons 
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
                <SidebarFooter isCollapsed={sidebarSize === "small"} />
            </Flex>
            
        </Flex>
    )

}

export default CollapsibleSidebar