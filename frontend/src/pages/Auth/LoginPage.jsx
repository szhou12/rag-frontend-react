import { Link } from '@chakra-ui/react';
import { Link as RouterLink } from '@tanstack/react-router';
import LoginForm from '@/features/Auth/LoginForm';
import { AuthLayout } from '@/layouts/Auth/AuthLayout';


const LoginPage = () => {
    return (
        <AuthLayout
            title="Welcome Back"
            description="Log in to enjoy our cool features! 😃"
            footer={
                <>
                    Don't have an account?{' '}
                    <Link 
                        as={RouterLink}
                        to="/register"
                        variant="underline"
                        color="ui.main"
                    >
                        Register here
                    </Link>
                </>
            }
        >
            <LoginForm />
        </AuthLayout>
    );
};

export default LoginPage;
