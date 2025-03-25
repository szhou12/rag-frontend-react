import { Box, HStack, Text } from '@chakra-ui/react'
import { UserMenu } from './UserMenu'
import useAuth from '@/hooks/useAuth'
import { Avatar } from "@/components/ui/avatar"

export const UserProfile = () => {
    const { user, logout } = useAuth()


    const avatarSrc = `https://api.dicebear.com/9.x/thumbs/svg?seed=${user.email}`

    return (
        <HStack gap="3" justify="space-between">
            <HStack gap="3">
                <Avatar src={avatarSrc} />

                <Box>
                    <Text textStyle="sm" fontWeight="medium">
                        {user.email}
                    </Text>
                </Box>
            </HStack>

            <UserMenu logout={logout} />
        </HStack>
    )
}