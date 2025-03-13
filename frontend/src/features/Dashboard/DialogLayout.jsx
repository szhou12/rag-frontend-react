import {
    Button,
    Dialog,
    Flex,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react"

const DialogLayout = ({ 
    title, 
    onSubmit, 
    children, 
    isSubmitting, 
    isValid, 
    isOpen, 
    setIsOpen, 
    triggerButton
}) => {

    return (
        <Dialog.Root
            size={{ base: "xs", md: "md" }}
            placement="center"
            open={isOpen}
            onOpenChange={({ open }) => setIsOpen(open)}
        >
            {/* Button that opens the dialog */}
            <Dialog.Trigger asChild>
                {triggerButton}
            </Dialog.Trigger>

            {/* Dialog Content */}
            <Dialog.Content>
                <form onSubmit={onSubmit}>
                    <Dialog.Header>
                        <Dialog.Title>{title}</Dialog.Title>
                    </Dialog.Header>

                    {/* Form goes here */}
                    <Dialog.Body>{children}</Dialog.Body>

                    <Dialog.Footer gap={2}>
                        <Dialog.ActionTrigger asChild>
                            <Button
                                variant="subtle"
                                colorPalette="gray"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                        </Dialog.ActionTrigger>
                        <Button
                            variant="solid"
                            type="submit"
                            disabled={!isValid}
                            isLoading={isSubmitting}
                        >
                            Save
                        </Button>
                    </Dialog.Footer>
                </form>

                <Dialog.CloseTrigger />
            </Dialog.Content>
        </Dialog.Root>
        
    )
}

export default DialogLayout;