import {
    Button,
    Dialog,
    Portal,
} from "@chakra-ui/react"

const DataFormLayout = ({ 
    title, 
    onSubmit, 
    isSubmitting, 
    isOpen, 
    setIsOpen, 
    triggerButton,
    submitButton,
    children,
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

            <Portal>
                {/* Adds a semi-transparent background. */}
                <Dialog.Backdrop />
                {/* Ensures the Dialog is positioned correctly on the screen */}
                <Dialog.Positioner>

                    <Dialog.Content>
                        <form onSubmit={onSubmit}>
                            <Dialog.Header>
                                <Dialog.Title>{title}</Dialog.Title>
                            </Dialog.Header>

                            {/* Form data collects from here */}
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

                                {submitButton}

                            </Dialog.Footer>
                        </form>

                        <Dialog.CloseTrigger />
                    </Dialog.Content>

                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
        
    )
}

export default DataFormLayout;