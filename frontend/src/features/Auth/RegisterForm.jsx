import {
    Button,
    Checkbox,
    Field,
    HStack,
    Input,
    Stack,
} from '@chakra-ui/react';
import { useForm } from "react-hook-form";
import { PasswordInput } from '@/components/ui/password-input';
import useAuth from '@/hooks/useAuth';
import { emailPattern, passwordRules, confirmPasswordRules } from '@/utils';

const RegisterForm = () => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            email: "",
            password: "",
            confirm_password: "",
        },
    })

    const { signUpMutation, error, resetError } = useAuth()

    const onSubmit = 
}
