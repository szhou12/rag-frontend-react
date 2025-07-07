import { Box, Stack, StackSeparator } from '@chakra-ui/react'
import { LuCircleHelp, LuLayoutDashboard, LuSettings } from 'react-icons/lu'

import { SidebarLink } from './SidebarLink'
import { UserProfile } from '@/components/Common/UserProfile'

export const SidebarFooter = ({ user, isCollapsed = false, ...props }) => {
    return (
        <Stack gap="4" separator={<StackSeparator />} {...props}>
            {/* <Box /> */}
            
            {!isCollapsed && (
                <Stack gap="1">
                    {user?.role !== "client" && (
                        <SidebarLink href="/dashboard/index">
                            <LuLayoutDashboard /> Staff Dashboard
                        </SidebarLink>
                    )}

                    <SidebarLink href="/help">
                        <LuCircleHelp /> Help Center
                    </SidebarLink>

                    <SidebarLink href="/settings">
                        <LuSettings /> Settings
                    </SidebarLink>
                </Stack>
            )}

            <UserProfile isCollapsed={isCollapsed} />
        </Stack>
    )
}