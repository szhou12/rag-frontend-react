import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import {
    Button,
    NumberInput,
    Input,
    Portal,
    Select,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FiEdit2 } from "react-icons/fi"
import { Field } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import { languages } from "@/constants/languages"
import { DataFormLayout } from "@/layouts/Dashboard/DataFormLayout"

const EditFile = ({ file }) => {
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
        defaultValues: file,
    })

    const mutation = useMutation({
        mutationFn: (data) => {
            // WebpagesService.updateWebpage({ webpageId: webpage.id, requestBody: data })
            console.log("Update File Info:", data)
        },

        onSuccess: () => {
            showSuccessToast("File info updated successfully!")
            reset()
            setIsOpen(false)
            
        },

        onError: (error) => {
            handleError(error, showErrorToast)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["files"] })
        },

    })

    const onSubmit = async (data) => {
        mutation.mutate(data)
    }

    return (
        <DataFormLayout
            title="Edit File Info"
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
                Update the info for this webpage.
            </Text>
            <VStack gap={4}>
                <Field
                    invalid={!!errors.filename}
                    errorText={errors.filename?.message}
                    label="Filename"
                >
                    <Input
                        id="filename"
                        type="text"
                        {...register("filename")}
                        _focusVisible={{
                            borderColor: "ui.main",
                            boxShadow: "0 0 0 1px var(--chakra-colors-ui-main)",
                        }}
                    />
                </Field>

                <Field
                    invalid={!!errors.author}
                    errorText={errors.author?.message}
                    label="Author(s)"
                >
                    <Input
                        id="author"
                        type="text"
                        {...register("author")}
                        _focusVisible={{
                            borderColor: "ui.main",
                            boxShadow: "0 0 0 1px var(--chakra-colors-ui-main)",
                        }}
                    />
                </Field>
            </VStack>

            {/* <Stack mt={4} gap="4" align="flex-start">
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
            </Stack> */}

        </DataFormLayout>
    )
}

export default EditFile