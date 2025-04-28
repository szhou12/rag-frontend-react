import { Box, IconButton } from '@chakra-ui/react'
import { LuUser, LuLogOut, LuEllipsisVertical } from 'react-icons/lu'
import { BsPersonBoundingBox } from "react-icons/bs"
import { Link } from '@tanstack/react-router'
import {
    MenuRoot,
    MenuTrigger,
    MenuContent,
    MenuItem,
    MenuItemText
} from '@/components/ui/menu'

export const UserMenu = ({ logout, isCollapsed = false }) => {

    const handleLogout = () => {
        logout()
    }

    return (
        <MenuRoot>
            <MenuTrigger asChild>
                <IconButton 
                    variant="ghost" 
                    color="black"
                    aria-label="Open User Menu"
                >
                    {isCollapsed ? <BsPersonBoundingBox /> : <LuEllipsisVertical />}
                </IconButton>
            </MenuTrigger>

            <MenuContent zIndex={1400}>
                <Link to="/settings">
                    <MenuItem
                        closeOnSelect
                        value="user-settings"
                        gap={2}
                        py={2}
                        style={{ cursor: "pointer" }}
                    >
                        <LuUser fontSize="18px" />
                        <Box flex="1">My Profile</Box>
                    </MenuItem>
                </Link>

                <MenuItem
                    closeOnSelect
                    value="logout"
                    gap={2}
                    py={2}
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}   
                >
                    <LuLogOut fontSize="18px" />
                    <Box flex="1">Log Out</Box>
                </MenuItem>
            </MenuContent>
        </MenuRoot>
    )
}