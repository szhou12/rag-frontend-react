import {
    Badge,
    Box,
    Button,
    Center,
    Container,
    Heading,
    Icon,
    Image,
    Show,
    Stack,
    Text,
} from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { LuRocket } from 'react-icons/lu'

export const HeroHeader = (props) => {
    const { tagline, headline, description, ...rootProps } = props
    return (
        <Stack gap={{ base: '6', md: '8' }} {...rootProps}>
            <Stack gap={{ base: '5', md: '6' }}>
                <Stack gap={{ base: '3', md: '4' }}>
                    <Show when={tagline}>
                        <Text textStyle={{ base: 'sm', md: 'md' }} fontWeight="medium" color="ui.main">
                            {tagline}
                        </Text>
                    </Show>
                    <Heading color="ui.main" as="h1" textStyle={{ base: '4xl', md: '6xl' }} fontWeight="bold">
                        {headline}
                    </Heading>
                </Stack>
                <Text color="ui.dim" textStyle={{ base: 'lg', md: 'xl' }} maxW="3xl">
                    {description}
                </Text>  
            </Stack>
            {props.children}
        </Stack>
    )
}

export const ImagePlaceholder = (props) => {
    return (
        <Center
            w="full"
            h="full"
            bg="ui.dim"
            {...props}
        >
            <Image
                alt={'Home Page Image'}
                objectFit={'cover'}
                w="100%" 
                h="100%"
                src={
                    'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
            />
        </Center>
    )
    
}

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <Box position="relative" height={{ lg: '720px' }}>
            <Container py={{ base: '16', md: '24' }} height="full">
                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    gap={{ base: '16' }}
                    align={{ lg: 'center' }}
                    height="full"
                >
                    <HeroHeader
                        tagline={
                            <Badge size="lg" colorPalette="ui.main">
                                <Icon size="sm">
                                    <LuRocket />
                                </Icon>
                                RMI
                            </Badge>
                        }
                        justifyContent="center"
                        maxW={{ md: 'xl', lg: 'md', xl: 'xl' }}
                        headline="Your Clean Energy AI Consultant"
                        description="以RMI的海量能源数据与分析作支撑, 为您创建客制化的AI咨询服务"
                    >
                        <Stack direction={{ base: 'column', md: 'row' }} gap="3">
                            <Button
                                variant='dashed' 
                                borderColor={'ui.main'}
                                color={'ui.main'}
                                _hover={{
                                    transform: 'translate(-4px, -4px)',
                                    rounded: 'md',
                                    shadow: `4px 4px 0px var(--chakra-colors-ui-main)`,
                                }}
                                onClick={() => navigate({ to: '/login' })}
                            >
                                Log In
                            </Button>
                            <Button
                                variant='dashed'
                                onClick={() => navigate({ to: '/register' })}
                            >
                                Sign Up
                            </Button>
                            <Button
                                variant='dashed'
                                borderColor={'ui.success'}
                                color={'ui.success'}
                                _hover={{
                                    transform: 'translate(-4px, -4px)',
                                    rounded: 'md',
                                    shadow: `4px 4px 0px var(--chakra-colors-ui-success)`,
                                }}
                                onClick={() => navigate({ to: '/login-staff' })}
                            >
                                <Icon size="sm">
                                    <LuRocket />
                                </Icon>
                                Login As Staff
                            </Button>
                        </Stack>
                    </HeroHeader>

                    <Box
                        pos={{ lg: 'absolute' }}
                        right="0"
                        bottom="0"
                        w={{ base: 'full', lg: '50%' }}
                        height={{ base: '96', lg: 'full' }}
                        css={{
                            clipPath: { lg: 'polygon(7% 0%, 100% 0%, 100% 100%, 0% 100%)' },
                        }}
                    >
                        <ImagePlaceholder />
                    </Box>

                </Stack>
            </Container>
        </Box>
    )

}
