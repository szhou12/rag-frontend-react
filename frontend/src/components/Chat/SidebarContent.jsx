// frontend/src/components/Chat/SidebarContent.jsx
import { 
    Box,
    Stack,
    Text,
    Flex,
    Spinner,
    VStack,
} from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { BsChatTextFill } from 'react-icons/bs'

import { v4 as uuidv4 } from 'uuid'

import { SidebarChatList } from './SidebarChatList'
import { SearchField } from '../Common/SearchField'

import { ChatService } from './mocks/chatService'



export const SidebarContent = () => {
    const { data: chats, isPending, error } = useQuery({
        queryFn: () => ChatService.getConversations(),
        queryKey: ["userChats"],
    })

    return (
        <Stack flex="1" overflow="hidden" px="4" spacing="4" my={{ base: "2", md: "0" }}>
            <Text fontSize="lg" fontWeight="medium">
                Conversations ({chats?.length})
            </Text>

            <Flex>
                <SearchField />
            </Flex>

            <SidebarChatList 
                data={chats}
                isPending={isPending}
                error={error} 
            />
            
        </Stack>
    )
}