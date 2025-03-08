import {
    Button,
    Checkbox,
    Field,
    HStack,
    Input,
    Link,
    Stack,
    Text,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from '@tanstack/react-router';
import { useForm } from "react-hook-form"
import { useColorModeValue } from "@/components/ui/color-mode";
import { PasswordInput } from '@/components/ui/password-input';
import { useAuth } from '@/hooks/useAuth';
import { emailPattern, passwordRules } from '@/utils';

const LoginStaffForm = () => {
    const { loginMutation, error, resetError } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            email: "",
            password: "",
            isAdmin: false,
        }
    })

    const onSubmit = async (data) => {
        if (isSubmitting) return

        resetError()

        try {
            // Call `loginMutation` to actually send the login request to the backend.
            await loginMutation.mutateAsync(data)
        } catch (error) {
            // `loginMutation` inside handles error, which displays the error by a toast
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="6">
                <Stack gap="5">
                    <Field.Root>
                        <Field.Label >Email</Field.Label>    
                        <Input   
                            id="email"
                            {...register("email", { 
                                required: "Email is required",
                                pattern: emailPattern,
                            })}
                            type="email"
                            _focusVisible={{
                                borderColor: "ui.main",
                                boxShadow: "0 0 0 1px var(--chakra-colors-ui-main)",
                            }}
                        />
                                      
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Password</Field.Label>
                        <PasswordInput 
                            type="password"
                            {...register("password", passwordRules())}
                            errors={errors}
                            _focusVisible={{
                                borderColor: "ui.main",
                                boxShadow: "0 0 0 1px var(--chakra-colors-ui-main)",
                            }}
                        />
                    </Field.Root>
                </Stack>

                <HStack justify="space-between">
                    <Checkbox.Root
                        variant="solid"
                        colorPalette="teal"
                        defaultChecked={false}
                    >
                        <Checkbox.HiddenInput 
                            {...register("isAdmin", {
                                onChange: (e) => console.log("Admin status changed:", e.target.checked)
                            })}
                        />
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>is Admin?</Checkbox.Label>
                    </Checkbox.Root>
                </HStack>

                <Stack gap="4">
                    <Button
                        variant="solid"
                        type="submit"
                        isLoading={isSubmitting}
                    >
                        Log in
                    </Button>
                </Stack>

            </Stack>
        </form>
    );
};

export default LoginStaffForm;