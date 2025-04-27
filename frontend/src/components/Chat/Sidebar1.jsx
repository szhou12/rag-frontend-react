import { useState } from 'react'
import { 
    Box,
    IconButton,
    Drawer,
    CloseButton,
    Portal,
} from '@chakra-ui/react'
import { LuAlignRight } from 'react-icons/lu'
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb"
import { SidebarContent } from './SidebarContent'

export const Sidebar1 = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <>
            {/* Mobile Drawer */}
            <Drawer.Root
                placement="start"
                isOpen={isOpen}
                onOpenChange={setIsOpen}
            >
                <Drawer.Trigger asChild>
                    <IconButton
                        variant="ghost"
                        aria-label="Open Menu"
                        colorPalette="gray"
                        display={{ base: "flex", md: "none" }}
                    >
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
                            <SidebarContent onClose={() => setIsOpen(false)} />
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>

            {/* Desktop Sidebar */}
            <Box
                display={{ base: "none", md: "flex" }}
                position="sticky"
                bg="bg.panel"
                top={0}
                minW={isCollapsed ? "60px" : "xs"}
                h="100vh"
                p={4}
                borderRightWidth="1px"
                transition="width 0.2s ease-in-out"
            >
                <Box position="relative" w="100%">
                <IconButton
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    position="absolute"
                    right="-100px"
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={1}
                    display={{ base: "none", md: "flex" }} // hide on mobile view
                >
                    {isCollapsed ? <TbLayoutSidebarLeftExpand /> : <TbLayoutSidebarLeftCollapse />}
                </IconButton>

                    {!isCollapsed && <SidebarContent />}
                    
                </Box>
            </Box>
        </>
    )
}