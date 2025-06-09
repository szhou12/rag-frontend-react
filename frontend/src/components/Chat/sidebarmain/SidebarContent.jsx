import { 
    Box,
    Stack,
    Text,
    Flex,
    Spinner,
    VStack,
} from '@chakra-ui/react'
// import { Link } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query"
import { BsChatTextFill } from 'react-icons/bs'
import { useState, useEffect } from 'react'

import { TabList } from './TabList'
import { ChatService } from '../mocks/chatService'

export const SidebarContent = ({ ...props }) => {
    const { data: chats, isPending, error } = useQuery({
        queryFn: () => ChatService.getConversations(),
        queryKey: ["userChats"],
    })

    return (
        <Stack gap="1" bg="red.500" {...props}>
            <Text fontSize="md" fontWeight="medium" alignSelf="start">
                Conversations ({chats?.length})
            </Text>

            <TabList 
                data={chats}
                isPending={isPending}
                error={error} 
            />
            
        </Stack>
    )
}
