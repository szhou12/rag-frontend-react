import { 
    Box,
    Stack,
    Text,
    Flex,
} from '@chakra-ui/react'
import { BsChatTextFill, BsMicFill, BsPaperclip, BsPinAngleFill } from 'react-icons/bs'


import { ChatMessage } from './ChatMessage'
import { SearchField } from '../Common/SearchField'
import { ChatGroupHeader } from './ChatGroupHeader'
import { group, messages } from './fakedata'


export const Sidebar = (props) => {

    // const ConversationList = () => (
    //     <Box
    //         flex="1"
    //         overflow="auto"
    //     >
    //         <Stack gap="1">
    //             <SidebarLink href="">
    //                 Conversation 1
    //             </SidebarLink>

    //             <SidebarLink href="">
    //                 Conversation 2
    //             </SidebarLink>
                
    //         </Stack>
    //     </Box> 
    // )

    // return (
    //     <SidebarLayout {...props}>
    //         <ConversationList />
    //     </SidebarLayout>
    // )

    const Header = () => (
        <Box px="5">
            <Text fontSize="lg" fontWeight="medium">
                Messages ({messages.length})
            </Text>
        </Box>
    )

    const ChatList =() => (
        <Stack mt="2" spacing="4" flex="1" overflowY="auto" px="5" pb="5">
            <Stack mt="2" spacing="4">

                <ChatGroupHeader icon={BsChatTextFill}>Prev Chats</ChatGroupHeader>

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
            spacing="4"
            width="320px"
            borderEndWidth="1px"
            pt="6"
            {...props}
        >
            <Header />

            <Flex px="4">
                <SearchField />
            </Flex>

            <ChatList />
        </Stack>
    )
}