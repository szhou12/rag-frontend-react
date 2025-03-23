import LoginStaffForm from '@/features/Auth/LoginStaffForm';
import { AuthLayout } from '@/layouts/Auth/AuthLayout';

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