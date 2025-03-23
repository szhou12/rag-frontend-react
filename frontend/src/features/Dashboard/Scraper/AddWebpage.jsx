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
import { FaPlus } from "react-icons/fa"

import useCustomToast from "@/hooks/useCustomToast"
import { Field } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { urlPattern, handleError } from "@/utils"
import { languages } from "@/constants/languages"
import { DataFormLayout } from "@/layouts/Dashboard/DataFormLayout"

const AddWebpage = () => {
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
            url: "",
            pages: 1,
            language: "",
            refresh_frequency: 0,
            auto_download: false,
        }
    })

    const mutation = useMutation({
        // TODO: probly needs async function
        mutationFn: (data) => {
            // WebpagesService.createWebpages({ requestBody: data })
            console.log("Add Webpage:", data)
        },

        onSuccess: () => {
            showSuccessToast(`${getValues("pages")} Webpage(s) scraped successfully!`)
            reset({
                url: "",
                pages: 1,
                language: "",
                refresh_frequency: 0,
                auto_download: false,
            })
            setIsOpen(false)
        },

        onError: (err) => {
            handleError(err, showErrorToast)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["webpages"] })
        },
    })

    const onSubmit = (data) => {
        mutation.mutate(data)
    }

    return (
        <DataFormLayout
            title="Scrape Webpage"
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerButton={
                <Button value="add-webpage" my={4}>
                    <FaPlus fontSize="16px" />
                    Scrape Web
                </Button>
            }
            submitButton={
                <Button
                    variant="solid"
                    type="submit"
                    disabled={!isValid}
                    loading={isSubmitting}
                >
                    Save
                </Button>
            }
        >
            <Text mb={4}>
                Add a URL to scrape.
            </Text>
            <VStack gap={4}>
                <Field
                    required
                    invalid={!!errors.url}
                    errorText={errors.url?.message}
                    label="URL"
                >
                    <Controller
                        control={control}
                        name="url" // key defined in useForm()
                        rules={{
                            required: "URL is required",
                            validate: urlPattern.validate,
                        }}
                        render={({field}) => (
                            <Input
                                {...field} // pass field.value to key in name="url" to contruct {"url": field.value} in useForm()
                                id="url"
                                type="url"
                                placeholder="https://www.example.com"
                                _focusVisible={{
                                    borderColor: "ui.main",
                                    boxShadow: "0 0 0 1px var(--chakra-colors-ui-main)",
                                }}
                            />
                        )}
                    />
                </Field>

                <Field
                    invalid={!!errors.pages}
                    errorText={errors.pages?.message}
                    label="Pages to Scrape"
                >
                    <Controller
                        control={control}
                        name="pages"
                        render={({field}) => (
                            <NumberInput.Root
                                name={field.name}
                                value={field.value}
                                onValueChange={({ value }) => {
                                    field.onChange(value)
                                }}
                                defaultValue="1"
                                min={1}
                                max={10}
                                width="100%"
                            >
                                <NumberInput.Control />
                                <NumberInput.Input onBlur={field.onBlur} />

                            </NumberInput.Root>
                        )}
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
                                defaultValue="0"
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

export default AddWebpage