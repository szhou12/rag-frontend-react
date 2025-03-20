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
import DataFormLayout from "../DataFormLayout"
import { languages } from "@/constants/languages"

const EditWebpage = ({ webpage }) => {
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
        defaultValues: webpage,
    })

    const mutation = useMutation({
        mutationFn: (data) => {
            // WebpagesService.updateWebpage({ webpageId: webpage.id, requestBody: data })
            console.log("Update Scraping Rules:", data)
        },

        onSuccess: () => {
            showSuccessToast("Scraping rules updated successfully!")
            reset()
            setIsOpen(false)
            
        },

        onError: (error) => {
            handleError(error, showErrorToast)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["webpages"] })
        },

    })

    const onSubmit = async (data) => {
        mutation.mutate(data)
    }

    return (
        <DataFormLayout
            title="Edit Scraping Rules"
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
                Update the scraping rules for this webpage.
            </Text>
            <VStack gap={4}>
                <Field
                    disabled
                    invalid={!!errors.url}
                    errorText={errors.url?.message}
                    label="URL"
                >
                    <Input
                        id="url"
                        {...register("url")}
                        type="url"
                    />
                </Field>

                <Field
                    invalid={!!errors.refresh_frequency}
                    errorText={errors.refresh_frequency?.message}
                    label="Refresh Frequency (Days)"
                >
                    <Controller
                        control={control}
                        name="refresh_frequency"
                        render={({field}) => (
                            <NumberInput.Root
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) => {
                                    field.onChange(value)
                                }}
                                min={0}
                                max={1095}
                                width="100%"
                            >
                                <NumberInput.Control />
                                <NumberInput.Input onBlur={field.onBlur} />

                            </NumberInput.Root>
                        )}
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

                <Controller
                    control={control}
                    name="auto_download"
                    render={({field}) => (
                        <Field disabled={field.disabled}>
                            <Switch
                                colorPalette="teal"
                                size="lg"
                                checked={field.value}
                                onCheckedChange={({ checked }) => field.onChange(checked)}
                            >
                                Activate auto-download?
                            </Switch>
                        </Field>
                    )}
                />
            </Stack>

        </DataFormLayout>
    )
}

export default EditWebpage