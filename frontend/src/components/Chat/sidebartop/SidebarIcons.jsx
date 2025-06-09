import { Stack, IconButton } from "@chakra-ui/react"
import { BsLayoutSidebarInset, BsPencilSquare, BsSearch } from "react-icons/bs"
import { LuLayoutDashboard } from 'react-icons/lu'
import { Tooltip } from "@/components/ui/tooltip"

// TODO: add links to tabs
export const SidebarIcons = ({
    user,
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

                {/* Search Button */}
                <Tooltip showArrow content="Search">
                    <IconButton
                        variant="ghost"
                        color="black"
                    >
                        <BsSearch />
                    </IconButton>
                </Tooltip>

                {/* New Chat Button */}
                <Tooltip showArrow content="New Chat">
                    <IconButton
                        variant="ghost"
                        color="black"
                    >
                        <BsPencilSquare />
                    </IconButton>
                </Tooltip>

                {/* Staff Dashboard Button */}
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

                {/* Add more start-aligned buttons here */}
                

            </Stack>
        </Stack>
    )
}