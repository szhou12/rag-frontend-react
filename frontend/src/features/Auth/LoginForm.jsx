import { useState } from 'react';
import {
    Box,
    Field,
    Input,
    Stack,
    Button,
    Text,
    Link,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from '@tanstack/react-router';
import { useColorModeValue } from "@/components/ui/color-mode";
// import { useAuth } from '../../hooks/useAuth';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    // const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add your login logic here
        console.log('Login attempt with:', { email, password });
        // For now, always navigate to staff dashboard regardless of input
        if (email && password) {
        //   login();  // Set authenticated to true
          navigate({ to: '/chat' });
        }
      };

    return (
        <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'ui.darkSlate')}
            boxShadow={'lg'}
            p={8}
        >
            <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <Field.Root id="email" isRequired>
                        <Field.Label>Email address</Field.Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Field.Root>

                    <Field.Root id="password" isRequired>
                        <Field.Label>Password</Field.Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Field.Root>

                    <Stack spacing={10}>
                        <Stack
                            direction={{ base: 'column', sm: 'row' }}
                            align={'start'}
                            justify={'space-between'}
                        >
                            <Link
                                as={RouterLink}
                                to="/forgot-password"
                                color={'ui.main'}
                                _hover={{ color: '#00766C' }}
                            >
                                Forgot password?
                            </Link>
                        </Stack>
                        <Button type="submit" variant="solid">
                            Log in
                        </Button>
                        <Text align={'center'}>
                            Don't have an account?{' '}
                            <Link
                                as={RouterLink}
                                to="/register"
                                color={'ui.main'}
                                _hover={{ color: '#00766C' }}
                            >
                                Register here
                            </Link>
                        </Text>
                    </Stack>
                </Stack>
            </form>
        </Box>
    );
};

export default LoginForm;