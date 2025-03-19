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
import { FiTrash2 } from "react-icons/fi"
import { Field } from "@/components/ui/field"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import DataFormLayout from "../DataFormLayout"

const DeleteFile = ({ id }) => {
    // state whether the dialog is open or closed
    const [isOpen, setIsOpen] = useState(false)

    const queryClient = useQueryClient()
    const { showSuccessToast, showErrorToast } = useCustomToast()

    const {
        handleSubmit,
        formState: {isSubmitting},
    } = useForm()

    // TODO: UPDATE when backend is ready
    const deleteFile = async(id) => {
        // FilesService.deleteFile({ id })

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))
        console.log("Delete File:", id)
    }

    const mutation = useMutation({
        mutationFn: deleteFile,

        onSuccess: () => {
            showSuccessToast("File deleted successfully")
            setIsOpen(false)
        },

        onError: (err) => {
            handleError(err, showErrorToast)
        },

        onSettled: () => {
            queryClient.invalidateQueries()
        },
        
    })

    const onSubmit = async () => {
        mutation.mutate(id)
    }

    return (
        <DataFormLayout
            title="Delete File"
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerButton={
                <Button variant="ghost" colorPalette="red" size="sm" w="full" justifyContent="start">
                    <FiTrash2 fontSize="16px" />
                    Delete
                </Button>
            }
            submitButton={
                <Button
                    variant="solid"
                    colorPalette="red"
                    type="submit"
                    loading={isSubmitting}
                >
                    Delete
                </Button>
            }
        >
            <Text mb={4}>
                All data associated with this file will be{" "}
                <strong>permanently deleted.</strong> Are you sure? You will not
                be able to undo this action.
            </Text>
            
        </DataFormLayout>
    )
}

export default DeleteFile