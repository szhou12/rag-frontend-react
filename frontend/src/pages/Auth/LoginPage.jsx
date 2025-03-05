import AuthLayout from './AuthLayout';
import LoginForm from '@/features/Auth/LoginForm';

const LoginPage = () => {
    return (
        <AuthLayout
            title="Welcome Back"
            description="Log in to enjoy our cool features! 😃"
        >
            <LoginForm />
        </AuthLayout>
    );
};

export default LoginPage;
