import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import {
    Button,
    Dialog,
    Flex,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"

import useCustomToast from "@/hooks/useCustomToast"
import { Field } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"

const AddWebpage = () => {
    const [isOpen, setIsOpen] = useState(false)

    const { showSuccessToast, showErrorToast } = useCustomToast()

    return (
        <Dialog.Root
            size={{ base: "xs", md: "md" }}
            placement="center"
            open={isOpen}
            onOpenChange={({ open }) => setIsOpen(open)}
        >
            <Dialog.Trigger asChild>
                <Button
                    value="add-webpage"
                    my={4}
                >
                    <FaPlus fontSize="16px" />
                    Scrape Web
                </Button>
            </Dialog.Trigger>

            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Scrape Web</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                    <Text mb={4}>
                        Work in progress
                    </Text>

                </Dialog.Body>
                <Dialog.CloseTrigger />
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default AddWebpage