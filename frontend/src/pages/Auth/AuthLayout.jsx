import {
    Container,
    Heading,
    Image,
    Stack,
    Text,
} from '@chakra-ui/react';
import Logo from "/rmi_logo_horitzontal_no_tagline.svg"
import { useColorModeValue } from "@/components/ui/color-mode";

const AuthLayout = ({ title, description, children, footer }) => {
    return (
        // <Flex
        //     minH={'100vh'}
        //     align={'center'}
        //     justify={'center'}
        //     bg={useColorModeValue('ui.light', 'ui.dark')}
        // >
        //     <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        //         <Stack align={'center'}>
        //             <Heading fontSize={'4xl'}>{title}</Heading>
        //             <Text fontSize={'lg'} color={'ui.dim'}>
        //                 {description}
        //             </Text>
        //         </Stack>
        //         {children}
        //     </Stack>
        // </Flex>
        <Container maxW="md" py={{ base: '12', md: '24' }}>
            <Stack gap="8">
                <Image src={Logo} alt="RMI Logo" w="180px" maxW="2xs" />
                <Stack gap={{ base: '2', md: '3' }} textAlign="center">
                    <Heading size={{ base: '2xl', md: '3xl' }}>{title}</Heading>
                    <Text color="ui.dim">{description}</Text>
                </Stack>
                {children}
                
                {footer && (
                    <Text textStyle="sm" color="ui.dim" textAlign="center">
                        {footer}
                    </Text>
                )}
            </Stack>
        </Container>
    );
};

export default AuthLayout;