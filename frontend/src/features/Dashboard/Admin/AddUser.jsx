import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import {
    Button,
    Dialog,
    Flex,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Field } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import useCustomToast from "@/hooks/useCustomToast"
import DialogLayout from "../DialogLayout"
import { emailPattern, handleError } from "@/utils"

const AddUser = () => {
    // state whether the dialog is open or closed
    const [isOpen, setIsOpen] = useState(false)

    const queryClient = useQueryClient()

    const { showSuccessToast, showErrorToast } = useCustomToast()

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            role: "user",
            isActive: true,
        }
    })

    // data: UserCreate
    const mutation = useMutation({
        mutationFn: (data) => {
            // UsersService.createUser({ requestBody: data })
            console.log(data)
        },

        onSuccess: () => {
            showSuccessToast("User created successfully")
            reset()
            setIsOpen(false)
        },

        onError: (err) => {
            handleError(err, showErrorToast)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
    })

    const onSubmit = (data) => {
        mutation.mutate(data)
    }

    return (
        <DialogLayout
            title="Add User"
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            isValid={isValid}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerButton={
                <Button value="add-user" my={4}>
                    <FaPlus fontSize="16px" />
                    Add User
                </Button>
            }
        >
            <Text mb={4}>
                Fill in the form below to add a new user to the system.
            </Text>
            <VStack gap={4}>
                <Field
                    required
                    invalid={!!errors.email}
                    errorText={errors.email?.message}
                    label="Email"
                >
                    <Input
                        id="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: emailPattern,
                        })}
                        type="email"
                        placeholder="Email"
                        _focusVisible={{
                            borderColor: "ui.main",
                            boxShadow: "0 0 0 1px var(--chakra-colors-ui-main)",
                        }}
                    />
                </Field>

                <Field
                    required
                    invalid={!!errors.password}
                    errorText={errors.password?.message}
                    label="Set Password"
                >
                    <PasswordInput
                        type="password"
                        {...register("password", passwordRules())}
                        
                    />
                </Field>

            </VStack>
        </DialogLayout>
    )
}

export default AddUser