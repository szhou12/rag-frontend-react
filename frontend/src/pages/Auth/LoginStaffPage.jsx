import AuthLayout from './AuthLayout';
import LoginStaffForm from '@/features/Auth/LoginStaffForm';

const LoginStaffPage = () => {
    return (
        <AuthLayout
            title="Hello Staff"
            description="Log in to access our dashboard! 😃"
            footer={
                <>
                    Don't have an account?{' '}
                    Please contact the admin.
                </>
            }
        >
            <LoginStaffForm />
        </AuthLayout>
    );
};

export default LoginStaffPage;