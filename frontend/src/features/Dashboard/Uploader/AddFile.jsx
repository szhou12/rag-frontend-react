import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import {
    Button,
    Box,
    createListCollection,
    FileUpload,
    HStack,
    Icon,
    Input,
    Portal,
    Select,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { LuUpload } from "react-icons/lu"

import useCustomToast from "@/hooks/useCustomToast"
import { Field } from "@/components/ui/field"
import { handleError } from "@/utils"
import { languages } from "@/constants/languages"
import { DataFormLayout } from "@/layouts/Dashboard/DataFormLayout"

const AddFile = () => {
    const [isOpen, setIsOpen] = useState(false)

    const queryClient = useQueryClient()

    const { showSuccessToast, showErrorToast } = useCustomToast()

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid, isSubmitting },
    } = useForm({
        mode: "onChange", // Validation occurs as soon as values change
        criteriaMode: "all",
        defaultValues: {
            file: null,
            language: "",
            filename: "",
            author: "",
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
            reset()
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
        <DataFormLayout
            title="Upload File"
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerButton={
                <Button value="add-file" my={4}>
                    <FaPlus fontSize="16px" />
                    Upload File
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
                Upload a file and select the text language.
            </Text>
            
            <VStack gap={4}>
                <Field
                    required
                    invalid={!!errors.file}
                    errorText={errors.file?.message}
                    label="File"
                >
                    <Controller
                        control={control}
                        name="file"
                        rules={{ required: "File is required" }}
                        render={({field}) => (
                            <FileUpload.Root
                                maxW="xl"
                                alignItems="stretch"
                                maxFiles={1} // # of files can be uploaded at once
                                accept={[
                                    "application/pdf",  // .pdf
                                    "application/vnd.ms-excel",  // .xls
                                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"  // .xlsx
                                ]}
                                onFileChange={(details) => {
                                    field.onChange(details.acceptedFiles[0] || null)
                                }}
                            >
                                <FileUpload.HiddenInput />
                                <FileUpload.Dropzone>
                                    <Icon size="md" color="ui.main">
                                        <LuUpload />
                                    </Icon>
                                    <FileUpload.DropzoneContent>
                                        <Box>
                                            Drag and drop a file here or click to upload
                                        </Box>
                                        <Box color="fg.muted">
                                            PDF, Excel (.xls, .xlsx) up to 10MB
                                        </Box>
                                    </FileUpload.DropzoneContent>
                                </FileUpload.Dropzone>
                                <FileUpload.List />
                            </FileUpload.Root>
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
                                    field.onChange(itemValue); // send value to hook form
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

                <HStack gap={4} w="full">

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
                </HStack>
            </Stack>

        </DataFormLayout>
    )
}

export default AddFile