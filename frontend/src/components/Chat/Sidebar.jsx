import { 
    Box,
    Stack,
    Text,
    Flex,
    StackSeparator,
} from '@chakra-ui/react'
import {
    LuLayoutDashboard,
    LuFileUp,
    LuGlobe,
    LuUsers,
    LuCircleHelp,
    LuSettings,
} from 'react-icons/lu'
import { BsChatTextFill, BsMicFill, BsPaperclip, BsPinAngleFill } from 'react-icons/bs'


import { ChatMessage } from './ChatMessage'
import { SearchField } from '../Common/SearchField'
import { ChatGroupHeader } from './ChatGroupHeader'
import { group, messages } from './fakedata'
import { SidebarFooter } from '../Common/SidebarFooter'


export const Sidebar = (props) => {


    const Header = () => (
        <Box px="5">
            <Text fontSize="lg" fontWeight="medium">
                Conversations ({messages.length})
            </Text>
        </Box>
    )

    const ChatList =() => (
        <Stack mt="2" spacing="4" flex="1" overflowY="auto" px="5" pb="5">
            <Stack mt="2" spacing="4">

                <ChatGroupHeader icon={BsChatTextFill}>history</ChatGroupHeader>

                <Stack spacing="0" mx="-4">
                    {messages.map((message, index) => (
                        <ChatMessage key={index} data={message} />
                    ))}
                </Stack>
            </Stack>

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
            <Header />

            <Flex px="4">
                <SearchField />
            </Flex>

            <ChatList />

            <SidebarFooter />
        </Stack>
    )
}