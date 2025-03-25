import {
    Box,
    Stack,
    StackSeparator,
    Image,
} from '@chakra-ui/react'
import {
    LuLayoutDashboard,
    LuFileUp,
    LuGlobe,
    LuUsers,
    LuCircleHelp,
    LuSettings,
} from 'react-icons/lu'
import useAuth from '@/hooks/useAuth'
// import { SidebarLayout } from '@/layouts/Common/SidebarLayout'
import Logo from "/rmi_logo_horitzontal_no_tagline.svg"
import { SidebarLink } from '@/components/Common/SidebarLink'
import { SearchField } from '@/components/Common/SearchField'
import { SidebarFooter } from '@/components/Common/SidebarFooter'

export const Sidebar = (props) => {
    const { isAdmin } = useAuth()

    const DashboardContent = () => (
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
            
            {isAdmin() && (
                <SidebarLink href="/dashboard/admin">
                    <LuUsers /> Admin
                </SidebarLink>
            )}
        </Stack>
    )

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
                <DashboardContent />
            </Stack>

            <SidebarFooter />
        </Stack>
    )
}