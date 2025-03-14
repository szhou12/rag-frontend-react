import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import {
    Button,
    createListCollection,
    Input,
    Portal,
    Select,
    Span,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { Field } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import useCustomToast from "@/hooks/useCustomToast"
import DialogLayout from "../DialogLayout"
import { emailPattern, passwordRules, confirmPasswordRules, handleError } from "@/utils"

const roles = createListCollection({
    items: [
        { 
            label: "User", 
            value: "user",
            description: "Access to Chat Page",
         },
        { 
            label: "Staff", 
            value: "staff",
            description: "Access to Chat Page and Dashboard",
        },
        { 
            label: "Admin", 
            value: "admin",
            description: "Access to Chat Page, Dashboard, and Users Management",
        },
    ],
})

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
        getValues,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        mode: "onBlur",
        criteriaMode: "all",
        defaultValues: {
            email: "",
            password: "",
            confirm_password: "",
            role: "",
            is_active: true,
            // is_superuser: false,
        }
    })

    // data: UserCreate
    const mutation = useMutation({
        mutationFn: (data) => {
            // UsersService.createUser({ requestBody: data })
            console.log("Admin Add User:", data)
        },

        onSuccess: () => {
            showSuccessToast("User created successfully")
            // reset the form data to default values
            reset({
                email: "",
                password: "",
                confirm_password: "",
                role: "",
            })
            setIsOpen(false)
        },

        onError: (err) => {
            handleError(err, showErrorToast)
        },

        onSettled: () => {
            // Trigger React-Query to refetch users list that includes the newly added user from backend so that the data table will update with the new user without manually refreshing the page
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
                        id="confirmPassword"
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

        </DialogLayout>
    )
}

export default AddUser