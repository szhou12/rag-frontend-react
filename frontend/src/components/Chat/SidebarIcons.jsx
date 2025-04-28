import { Stack, IconButton } from "@chakra-ui/react"
import { BsLayoutSidebarInset, BsPencilSquare, BsPersonBoundingBox } from "react-icons/bs"

export const SidebarIcons = ({
    isCollapsed,
    onToggleSidebar,
}) => {
    return (
        <Stack
            direction={isCollapsed ? "column" : "row"}
            p={2}
            justifyContent="space-between"
        >
            {/* First group - aligned to start */}
            <Stack
                direction={isCollapsed ? "column" : "row"}
                spacing={2}
                hideBelow="md"
            >
                {/* Collapse Button */}
                <IconButton
                    onClick={onToggleSidebar}
                    variant="ghost"
                    color="black"
                >
                    <BsLayoutSidebarInset />
                </IconButton>

                {/* Add more start-aligned buttons here */}

            </Stack>

            {/* Second group - aligned to end */}
            <Stack
                direction={isCollapsed ? "column" : "row"}
                spacing={2}
            >
                {/* New Chat Button */}
                <IconButton
                    variant="ghost"
                    color="black"
                >
                    <BsPencilSquare />
                </IconButton>

                {/* Add more start-aligned buttons here */}
                

            </Stack>
        </Stack>
    )
}