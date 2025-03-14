import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import {
    Button,
    createListCollection,
    Dialog,
    Flex,
    Input,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"

import useCustomToast from "@/hooks/useCustomToast"
import { Field } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"

const languages = createListCollection({
    items: [
        { 
            label: "English", 
            value: "en",
         },
        { 
            label: "中文", 
            value: "zh",
        },
    ],
})

const AddFile = () => {
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
            file: null,
            language: "",
        }
    })

    const mutation = useMutation({
        // TODO: probly needs async function
        mutationFn: (data) => {
            // UsersService.createUser({ requestBody: data })
            console.log("Add File:", data)
        },

        onSuccess: () => {
            showSuccessToast("File uploaded successfully")
            reset({
                file: null,
                language: "",
            })
            setIsOpen(false)
        },

        onError: (err) => {
            handleError(err, showErrorToast)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["files"] })
        },
    })

    const onSubmit = (data) => {
        mutation.mutate(data)
    }

    return (
        <DialogLayout
            title="Upload File"
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            isValid={isValid}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerButton={
                <Button value="add-file" my={4}>
                    <FaPlus fontSize="16px" />
                    Upload File
                </Button>
            }
        >
            <Text mb={4}>
                Upload a file and select the text language.
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

                
            </VStack>

            <Stack mt={4} gap="4" align="flex-start">
                <Field
                    required
                    invalid={!!errors.language}
                    errorText={errors.language?.message}
                    label="Language"
                >
                    <Controller
                        control={control}
                        name="language"
                        rules={{ required: "Text language is required" }}
                        render={({field}) => (
                            <Select.Root
                                name={field.name}
                                value={field.value ? [field.value] : []}
                                onValueChange={(selectedItem) => {
                                    const itemValue = Array.isArray(selectedItem.value) ? selectedItem.value[0] : selectedItem.value;
                                    field.onChange(itemValue);
                                }}
                                onInteractOutside={() => field.onBlur()}
                                collection={languages}
                            >
                                <Select.HiddenSelect />
                                <Select.Control>
                                    <Select.Trigger>
                                        <Select.ValueText placeholder="Select text language" />
                                    </Select.Trigger>
                                    <Select.IndicatorGroup>
                                        <Select.Indicator />
                                    </Select.IndicatorGroup>
                                </Select.Control>
                                <Portal>
                                    <Select.Positioner>
                                        <Select.Content zIndex={1500}>
                                            {languages.items.map((lang) => (
                                                <Select.Item item={lang} key={lang.value}>
                                                    {lang.label}
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

export default AddFile