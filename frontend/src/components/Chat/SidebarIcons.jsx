import { Stack, IconButton } from "@chakra-ui/react"
import { BsLayoutSidebarInset, BsPencilSquare } from "react-icons/bs"

import { Tooltip } from "@/components/ui/tooltip"

export const SidebarIcons = ({
    isCollapsed,
    onToggleSidebar,
    ...props
}) => {
    return (
        <Stack
            direction={isCollapsed ? "column" : "row"}
            p={2}
            justifyContent="space-between"
            {...props}
        >
            {/* First group - aligned to start */}
            <Stack
                direction={isCollapsed ? "column" : "row"}
                spacing={2}
                hideBelow="md"
            >
                {/* Collapse Button */}
                <Tooltip showArrow content={isCollapsed ? "Open Sidebar" : "Close Sidebar"}>
                    <IconButton
                        onClick={onToggleSidebar}
                        variant="ghost"
                        color="black"
                    >
                        <BsLayoutSidebarInset />
                    </IconButton>
                </Tooltip>

                

                {/* Add more start-aligned buttons here */}

            </Stack>

            {/* Second group - aligned to end */}
            <Stack
                direction={isCollapsed ? "column" : "row"}
                spacing={2}
            >
                {/* New Chat Button */}
                <Tooltip showArrow content="New Chat">
                    <IconButton
                        variant="ghost"
                        color="black"
                    >
                        <BsPencilSquare />
                    </IconButton>
                </Tooltip>
                

                {/* Add more start-aligned buttons here */}
                

            </Stack>
        </Stack>
    )
}