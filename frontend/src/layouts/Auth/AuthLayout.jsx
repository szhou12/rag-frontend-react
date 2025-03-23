import {
    Container,
    Heading,
    Image,
    Stack,
    Text,
} from '@chakra-ui/react';
import Logo from "/rmi_logo_horitzontal_no_tagline.svg"
import { useColorModeValue } from "@/components/ui/color-mode";

export const AuthLayout = ({ title, description, children, footer }) => {
    return (
        <Container maxW="md" py={{ base: '12', md: '24' }}>
            <Stack gap="8">
                <Image src={Logo} alt="RMI Logo" w="130px" maxW="2xs" alignSelf="center"/>
                <Stack gap={{ base: '2', md: '3' }} textAlign="center">
                    <Heading size={{ base: '2xl', md: '3xl' }} color="ui.main">{title}</Heading>
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
