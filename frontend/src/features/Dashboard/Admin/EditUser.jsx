import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import {
    Button,
    Input,
    Portal,
    Select,
    Span,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FiEdit2 } from "react-icons/fi"
import { Field } from "@/components/ui/field"
import useCustomToast from "@/hooks/useCustomToast"
import { emailPattern, passwordRules, confirmPasswordRules, handleError } from "@/utils"
import { roles } from "@/constants/roles"
import { DataFormLayout } from "@/layouts/Dashboard/DataFormLayout"


const EditUser = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false)

    const queryClient = useQueryClient()

    const { showSuccessToast, showErrorToast } = useCustomToast()

    const {
        control,
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: user, // auto-fill the original user data except for password (excluded by browser)
    })

    // TODO: UPDATE when backend is ready
    const mutation = useMutation({
        mutationFn: (data) => {
            // UsersService.updateUser({ userId: user.id, requestBody: data })
            console.log("Admin Update User:", data)
        },
            

        onSuccess: () => {
            showSuccessToast("User updated successfully!")
            reset()
            setIsOpen(false)
        },

        onError: (error) => {
            handleError(error, showErrorToast)
        },

        onSettled: () => {
            // trigger auto-refresh of users table only
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
        
    })

    const onSubmit = async (data) => {
        mutation.mutate(data)
    }

    return (
        <DataFormLayout
            title="Edit User"
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerButton={
                <Button variant="ghost" size="sm" w="full" justifyContent="start">
                    <FiEdit2 fontSize="16px" />
                    Edit
                </Button>
            }
            submitButton={
                <Button
                    variant="solid"
                    type="submit"
                    loading={isSubmitting}
                >
                    Save
                </Button>
            }
        >
            <Text mb={4}>
                Update the user information below.
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
                    label="New Password"
                >
                    <Input
                        id="password"
                        {...register("password", passwordRules())}
                        placeholder="Password"
                        type="password"
                    />
                </Field>

                <Field
                    required
                    invalid={!!errors.confirm_password}
                    errorText={errors.confirm_password?.message}
                    label="Confirm Password"
                >
                    <Input
                        id="confirm_password"
                        {...register("confirm_password", confirmPasswordRules(getValues))}
                        type="password"
                        placeholder="Confirm Password"
                    />
                </Field>
            </VStack>

            <Stack mt={4} gap="4" align="flex-start">
                <Field
                    required
                    invalid={!!errors.role}
                    errorText={errors.role?.message}
                    label="Role"
                >
                    <Controller
                        control={control}
                        name="role"
                        rules={{ required: "Role is required" }}
                        render={({field}) => (
                            <Select.Root
                                name={field.name}
                                value={field.value ? [field.value] : []}
                                onValueChange={(selectedItem) => {
                                    const roleValue = Array.isArray(selectedItem.value) ? selectedItem.value[0] : selectedItem.value;
                                    field.onChange(roleValue);
                                }}
                                onInteractOutside={() => field.onBlur()}
                                collection={roles}
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select a role" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content zIndex={1500}>
                                            {roles.items.map((role) => (
                                                <Select.Item item={role} key={role.value}>
                                                    <Stack gap="0">
                                                        <Select.ItemText>{role.label}</Select.ItemText>
                                                        <Span color="fg.muted" textStyle="sm">
                                                            {role.description}
                                                        </Span>
                                                    </Stack>
                                                    <Select.ItemIndicator />
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Positioner>
                                </Portal>
                            </Select.Root>
                        )}
                    />
                    
                </Field>
            </Stack>

            
        </DataFormLayout>
    )
        
}

export default EditUser