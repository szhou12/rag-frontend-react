import { Stack, VStack, Text, Spinner } from '@chakra-ui/react'
import { Link } from '@tanstack/react-router'

import { SidebarLink } from '../sidebarbottom/SidebarLink'

import { ChatTab } from './ChatTab'
// import { Route } from '@/routes/_chat-layout/chat-session'

export const TabList = ({ data, isPending, error, ...props }) => {

    return (
        <Stack gap="1" w="xs" {...props}>
            {isPending ? (
                <VStack colorPalette="teal">
                    <Spinner 
                        color="colorPalette.600"
                        css={{ "--spinner-track-color": "colors.gray.200" }}
                        size="lg"
                    />
                    <Text color="colorPalette.600">Loading...</Text>
                </VStack>
            ) : error ? (
                <Text px="4" color="red.500">Something went wrong!</Text>
            ) : (
                data?.map((message) => (
                    // <a key={message.id} href={`/chat/${message.id}`}>
                    //     <ChatTab data={message} />
                    // </a>
                    <SidebarLink href={`/chat/${message.id}`}>
                        <Text fontWeight="medium" truncate>
                            {message.title}
                        </Text>
                    </SidebarLink>
                ))
            )}
        </Stack>
    )
}