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
                        <SidebarLink>
                            <LuLayoutDashboard /> Staff Dashboard
                        </SidebarLink>
                    )}

                    <SidebarLink>
                        <LuCircleHelp /> Help Center
                    </SidebarLink>

                    <SidebarLink>
                        <LuSettings /> Settings
                    </SidebarLink>
                </Stack>
            )}

            <UserProfile isCollapsed={isCollapsed} />
        </Stack>
    )
}