import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import {
    Button,
    Text,
} from "@chakra-ui/react"
import { useState } from "react"
import { FiTrash2 } from "react-icons/fi"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import { DataFormLayout } from "@/layouts/Dashboard/DataFormLayout"

const DeleteUser = ({ id }) => {

    // state whether the dialog is open or closed
    const [isOpen, setIsOpen] = useState(false)

    const queryClient = useQueryClient()

    const { showSuccessToast, showErrorToast } = useCustomToast()

    const {
        handleSubmit,
        formState: {isSubmitting},
    } = useForm()

    // TODO: UPDATE when backend is ready
    const deleteUser = async (id) => {
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
            // trigger auto-refresh of users table so that the deleted user removed from the table
            // queryKey: ["users"] is defined in getUsersQueryOptions()
            // NOTE: No queryKey (queryClient.invalidateQueries()) means to auto-refresh all data tables including users table, files table and webpages table
            queryClient.invalidateQueries({ queryKey: ["users"] })
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
                All information associated with this user will also be{" "}
                <strong>permanently deleted.</strong> Are you sure? You will not
                be able to undo this action.
            </Text>
            
        </DataFormLayout>
    )
}

export default DeleteUser
