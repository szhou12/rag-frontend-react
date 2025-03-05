import {
    Flex, 
    Stack, 
    Heading, 
    Text,
} from '@chakra-ui/react';
import { useColorModeValue } from "@/components/ui/color-mode";

const AuthLayout = ({ title, description, children }) => {
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('ui.light', 'ui.dark')}
        >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>{title}</Heading>
                    <Text fontSize={'lg'} color={'ui.dim'}>
                        {description}
                    </Text>
                </Stack>
                {children}
            </Stack>
        </Flex>
    );
};

export default AuthLayout;