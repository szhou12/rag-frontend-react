import { Box, Image, Stack, StackSeparator } from '@chakra-ui/react'
import {
    LuLayoutDashboard,
    LuSettings,
    LuFileUp,
    LuGlobe,
    LuUsers,
    LuCircleHelp,
} from 'react-icons/lu'
import Logo from "/rmi_logo_horitzontal_no_tagline.svg"
import { SidebarLink } from './SidebarLink'
import { SearchField } from '../Common/SearchField'
import { UserProfile } from '../Common/UserProfile'

export const Sidebar = (props) => {
    return (
        <Stack
            flex="1"
            p={{ base: '4', md: '6' }}
            bg="bg.panel"
            borderRightWidth="1px"
            justifyContent="space-between"
            maxW="xs"
            {...props}
        >
            <Stack gap="6">
                <Image src={Logo} alt="RMI Logo" w="100px" maxW="2xs" style={{ alignSelf: 'center' }}/>
                <SearchField />
                <Stack gap="1">
                    <SidebarLink href="/dashboard">
                        <LuLayoutDashboard /> Home
                    </SidebarLink>

                    <SidebarLink href="/dashboard/scraper">
                        <LuGlobe /> Scraper
                    </SidebarLink>

                    <SidebarLink href="/dashboard/uploader">
                        <LuFileUp /> Uploader
                    </SidebarLink>

                    <SidebarLink href="/dashboard/admin">
                        <LuUsers /> Admin
                    </SidebarLink>
                </Stack>
            </Stack>

            <Stack gap="4" separator={<StackSeparator />}>
                <Box />
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
        </Stack>
    )
}