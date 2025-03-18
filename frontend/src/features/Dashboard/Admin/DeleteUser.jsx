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
import { emailPattern, passwordRules, confirmPasswordRules, handleError } from "@/utils"
import DataFormLayout from "../DataFormLayout"

const DeleteUser = ({ id }) => {

    // state whether the dialog is open or closed
    const [isOpen, setIsOpen] = useState(false)

    const queryClient = useQueryClient()

    const { showSuccessToast, showErrorToast } = useCustomToast()

    const {
        handleSubmit,
        formState: {isSubmitting},
    } = useForm()

    // TODO: DELETE when backend is ready
    const deleteUser = async(id) => {
        // UsersService.deleteUser({ id })

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))
        console.log("Admin Delete User:", id)
    }

    const mutation = useMutation({
        mutationFn: deleteUser,

        onSuccess: () => {
            showSuccessToast("User deleted successfully")
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
            title="Delete User"
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            triggerButton={
                <Button variant="ghost" colorPalette="red" size="sm">
                    <FiTrash2 fontSize="16px" />
                    Delete User
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
                All items associated with this user will also be{" "}
                <strong>permanently deleted.</strong> Are you sure? You will not
                be able to undo this action.
            </Text>
            
        </DataFormLayout>
    )
}

export default DeleteUser
