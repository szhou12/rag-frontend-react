import { Box, Stack, StackSeparator } from '@chakra-ui/react'
import { LuCircleHelp, LuSettings } from 'react-icons/lu'
import { SidebarLink } from './SidebarLink'
import { UserProfile } from './UserProfile'

export const SidebarFooter = () => {
    return (
        <Stack gap="4" separator={<StackSeparator />}>
            <Box /> {/* Spacer */}
            <Stack gap="1">
                <SidebarLink>
                    <LuCircleHelp /> Help Center
                </SidebarLink>

                <SidebarLink>
                    <LuSettings /> Settings
                </SidebarLink>
            </Stack>

            <UserProfile />
        </Stack>
    )
}
