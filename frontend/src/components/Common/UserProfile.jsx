import { Avatar, Box, HStack, IconButton, Text } from '@chakra-ui/react'
import { UserMenu } from './UserMenu'
import useAuth from '@/hooks/useAuth'

export const UserProfile = () => {
    const { user, logout } = useAuth()


    const avatarSrc = `https://api.dicebear.com/9.x/thumbs/svg?seed=${user.email}`

    return (
        <HStack gap="3" justify="space-between">
            <HStack gap="3">
                <Avatar.Root>
                    <Avatar.Fallback />
                    <Avatar.Image src={avatarSrc} />
                </Avatar.Root>

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