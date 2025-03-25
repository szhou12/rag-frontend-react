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


export const SidebarLayout = ({children, collapsible = false, ...props}) => {

    const SidebarContent = (
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
                {children}
            </Stack>

            <SidebarFooter />
        </Stack>
    )

    if (collapsible) {
        return (
            <Collapsible.Root>
                <Collapsible.Trigger paddingY="3">
                    <IconButton variant="ghost" aria-label="Open Sidebar" colorPalette="gray">
                        <BsLayoutSidebarInset />
                    </IconButton>
                </Collapsible.Trigger>
                <Collapsible.Content>
                    {SidebarContent}
                </Collapsible.Content>
            </Collapsible.Root> 
        )
    }



    return SidebarContent
}