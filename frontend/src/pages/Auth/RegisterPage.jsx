import { Link } from '@chakra-ui/react';
import { Link as RouterLink } from '@tanstack/react-router';
import AuthLayout from './AuthLayout';
import RegisterForm from '@/features/Auth/RegisterForm';

const RegisterPage = () => {
    return (
        <AuthLayout
            title="Create your account"
            description="Join us to get started ✌️"
            footer={
                <>
                    Already have an account?{' '}
                    <Link 
                        as={RouterLink}
                        to="/login"
                        variant="underline"
                        color="ui.main"
                    >
                        Log in
                    </Link>
                </>
            }
        >
            <RegisterForm />
        </AuthLayout>
    );
};

export default RegisterPage;