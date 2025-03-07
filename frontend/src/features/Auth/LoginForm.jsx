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

const LoginForm = () => {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     // Add your login logic here
    //     console.log('Login attempt with:', { email, password });
    //     // For now, always navigate to staff dashboard regardless of input
    //     if (email && password) {
    //       navigate({ to: '/chat' });
    //     }
    //   };

    const { loginMutation, error, resetError } = useAuth();

    /**
     * `register`: configure a <Input> to accept a form data, enabling validation rules, which are defined within the `register` function, such as required and pattern.
     * `handleSubmit`: processes the form data on submission, triggering validation.
     * A submit button triggers the `handleSubmit` function, which in turn calls the `onSubmit` function with the form data if validation is successful.
     * `errors`: contains validation error messages.
     * `isSubmitting`: true when `handleSubmit` is being called, false once submission process completes.
     * mode="onBlur": Executes validation when the user leaves an input field
     * criteriaMode="all": All failed validation rules for a field are collected
     * defaultValues: Sets initial values for the form inputs. This is the form data object that will be passed to the `onSubmit` function. 
     * e.g., { email: "abc@gmail.com", password: "11111111" }
     */
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
        }
    })

    /**
     * react-hook-form's `handleSubmit` expects a function `onSubmit` to:
     * - Receive the form `data`, collected from <Input> annotated with `register`.
     * - Run the actual submission logic (calling API, showing errors, navigating).
     */
    const onSubmit = async (data) => {
        // Prevent the form from submitting again if it's already submitting.
        if (isSubmitting) return

        // Clear any old error message before submitting again.
        resetError()

        try {
            // Call `loginMutation` to actually send the login request to the backend.
            await loginMutation.mutateAsync(data)
        } catch (error) {
            // `loginMutation` inside handles error, which displays the error by a toast
        }
    }

    /**
     * Note: Wrap the whole form layout within <form> to enable form handling and onSubmit behavior. react-hook-form automatically tracks the values of all fields that call register(). When the form submits, react-hook-form compiles all registered fields into a single object `data` and passes it to onSubmit.
     */

    return (
        // <Box
        //     rounded={'lg'}
        //     bg={useColorModeValue('white', 'ui.darkSlate')}
        //     boxShadow={'lg'}
        //     p={8}
        // >
        //     <form onSubmit={handleSubmit}>
        //         <Stack spacing={4}>
        //             <Field.Root id="email" isRequired>
        //                 <Field.Label>Email address</Field.Label>
        //                 <Input
        //                     type="email"
        //                     value={email}
        //                     onChange={(e) => setEmail(e.target.value)}
        //                 />
        //             </Field.Root>

        //             <Field.Root id="password" isRequired>
        //                 <Field.Label>Password</Field.Label>
        //                 <Input
        //                     type="password"
        //                     value={password}
        //                     onChange={(e) => setPassword(e.target.value)}
        //                 />
        //             </Field.Root>

        //             <Stack spacing={10}>
        //                 <Stack
        //                     direction={{ base: 'column', sm: 'row' }}
        //                     align={'start'}
        //                     justify={'space-between'}
        //                 >
        //                     <Link
        //                         as={RouterLink}
        //                         to="/forgot-password"
        //                         color={'ui.main'}
        //                         _hover={{ color: '#00766C' }}
        //                     >
        //                         Forgot password?
        //                     </Link>
        //                 </Stack>
        //                 <Button type="submit" variant="solid">
        //                     Log in
        //                 </Button>
        //                 <Text align={'center'}>
        //                     Don't have an account?{' '}
        //                     <Link
        //                         as={RouterLink}
        //                         to="/register"
        //                         color={'ui.main'}
        //                         _hover={{ color: '#00766C' }}
        //                     >
        //                         Register here
        //                     </Link>
        //                 </Text>
        //             </Stack>
        //         </Stack>
        //     </form>
        // </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="6">
                <Stack gap="5">
                    <Field.Root>
                        <Field.Label>Email</Field.Label>
                        <Input 
                            id="email"
                            {...register("email", { 
                                required: "Email is required",
                                pattern: emailPattern,
                            })}
                            type="email" 
                        />
                        
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Password</Field.Label>
                        <PasswordInput 
                            type="password"
                            {...register("password", passwordRules())}
                            errors={errors}
                        />
                    </Field.Root>
                </Stack>

                <HStack justify="space-between">
                    <Checkbox.Root defaultChecked>
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>Remember me</Checkbox.Label>
                    </Checkbox.Root>

                    <Button variant="plain" size="sm">
                        Forgot password?
                    </Button>
                </HStack>

                <Stack gap="4">
                    <Button
                        variant="solid"
                        type="submit" // triggers the form's onSubmit handler
                        isLoading={isSubmitting} // shows spinner when submitting
                    >
                        Log in
                    </Button>
                </Stack>

            </Stack>
        </form>
    );
};

export default LoginForm;