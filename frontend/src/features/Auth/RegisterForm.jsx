import {
    Button,
    Checkbox,
    HStack,
    Input,
    Stack,
} from '@chakra-ui/react';
import { useForm } from "react-hook-form";
import { PasswordInput } from '@/components/ui/password-input';
import { Field } from '@/components/ui/field';
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
            role: "client",
        },
    })

    const { signUpMutation, error, resetError } = useAuth()

    const onSubmit = (data) => {
        if (isSubmitting) return

        resetError()

        try {
            signUpMutation.mutate(data)
        } catch (error) {
            // `signUpMutation` inside handles error, which displays the error by a toast
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="6">
                <Stack gap="5">
                    <Field
                        label="Email"
                        invalid={!!errors.email} // Marks the field as invalid when an error exists
                        errorText={errors.email?.message} // Displays the error message
                    >
                        <Input
                            id="email"
                            type="email"
                            {...register("email", { 
                                required: "Email is required", 
                                pattern: emailPattern 
                            })}
                            _focusVisible={{
                                borderColor: "ui.main",
                                boxShadow: "0 0 0 1px var(--chakra-colors-ui-main)",
                            }}
                        />
                    </Field>

                    <Field
                        label="Password"
                        invalid={!!errors.password}
                    >
                        <PasswordInput 
                            type="password"
                            {...register("password", passwordRules())}
                            errors={errors}
                            _focusVisible={{
                                borderColor: "ui.main",
                                boxShadow: "0 0 0 1px var(--chakra-colors-ui-main)",
                            }}
                        />
                    </Field>

                    <Field
                        label="Confirm Password"
                        invalid={!!errors.confirm_password}
                    >
                        <PasswordInput 
                            type="confirm_password"
                            {...register("confirm_password", confirmPasswordRules(getValues))}
                            errors={errors}
                            _focusVisible={{
                                borderColor: "ui.main",
                                boxShadow: "0 0 0 1px var(--chakra-colors-ui-main)",
                            }}
                        />
                    </Field>
                </Stack>

                <Stack gap="4">
                    <Button
                        variant="solid"
                        type="submit"
                        isLoading={isSubmitting}
                    >
                        Sign up
                    </Button>
                </Stack>

            </Stack>
        </form>
    )
}

export default RegisterForm
