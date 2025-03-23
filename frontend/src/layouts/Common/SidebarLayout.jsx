import { 
    Box, 
    IconButton,
    Image, 
    Stack, 
    StackSeparator,
    Collapsible,
} from '@chakra-ui/react'
import {
    LuLayoutDashboard,
    LuSettings,
    LuFileUp,
    LuGlobe,
    LuUsers,
    LuCircleHelp,
} from 'react-icons/lu'
import { BsLayoutSidebarInset } from "react-icons/bs"
import Logo from "/rmi_logo_horitzontal_no_tagline.svg"
import { SidebarLink } from '@/components/Common/SidebarLink'
import { SearchField } from '@/components/Common/SearchField'
import { SidebarFooter } from '@/components/Common/SidebarFooter'


export const SidebarLayout = ({children, ...props}) => {

    return (
        <Collapsible.Root>
            <Collapsible.Trigger paddingY="3">
                <IconButton variant="ghost" aria-label="Open Sidebar" colorPalette="gray">
                    <BsLayoutSidebarInset />
                </IconButton>
            </Collapsible.Trigger>
            <Collapsible.Content>
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
                        {/* <Stack gap="1">
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

                        </Stack> */}
                        {children}
                    </Stack>

                    <SidebarFooter />
                </Stack>
            </Collapsible.Content>
        </Collapsible.Root> 
    )
}