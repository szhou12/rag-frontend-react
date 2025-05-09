import { 
    Container, 
    HStack, 
    IconButton, 
    Drawer, 
    CloseButton, 
    Portal, 
    Image,
} from '@chakra-ui/react'
import { LuAlignRight } from 'react-icons/lu'
import Logo from "/rmi_logo_horitzontal_no_tagline.svg"
import { Sidebar } from './Sidebar'

/**
 * 
 * Sidebar in mobile view.
 * 
 */
// props: ContainerProps (import from chakra-ui)
export const Navbar = (props) => {
    return (
        <Container py="2.5" background="bg.panel" borderBottomWidth="1px" {...props}>
            <HStack justify="space-between">
                <Image src={Logo} alt="RMI Logo" w="100px" maxW="2xs" />
                <Drawer.Root placement="start">
                    <Drawer.Trigger asChild>
                        <IconButton variant="ghost" aria-label="Open Menu" colorPalette="gray">
                            <LuAlignRight />
                        </IconButton>
                    </Drawer.Trigger>

                    <Portal>
                        <Drawer.Backdrop />
                        <Drawer.Positioner>
                            <Drawer.Content>
                                <Drawer.CloseTrigger asChild>
                                    <CloseButton 
                                        size="sm" 
                                        colorPalette="gray" 
                                        position='absolute'
                                        top='2'
                                        right='2' 
                                    />
                                </Drawer.CloseTrigger>

                                <Sidebar />

                            </Drawer.Content>
                        </Drawer.Positioner>
                    </Portal>
                    
                </Drawer.Root>
            </HStack>
        </Container>
    )
}