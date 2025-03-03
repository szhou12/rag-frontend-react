"use client"

import {
    Toaster as ChakraToaster,
    Portal,
    Spinner,
    Stack,
    Toast,
    createToaster,
} from "@chakra-ui/react"

// create a global toast manager with specific config
export const toaster = createToaster({
    placement: "top-end", // appear in the top-right corner of the screen
    pauseOnPageIdle: true,
})

// Portal: render the toasts outside the normal DOM hierarchy, ensuring they appear on top of other content
export const Toaster = () => {
    return (
        <Portal>
            <ChakraToaster
                toaster={toaster}
                insetInline={{ mdDown: "4" }}
            >
                {(toast) => (
                    <Toast.Root
                        width={{ md: "sm" }}
                        color={toast.meta?.color}
                    >
                        {toast.type === "loading" ? (
                            <Spinner size="sm" color="blue.solid" />
                        ) : (
                            <Toast.Indicator />
                        )}
                        <Stack gap="1" flex="1" maxWidth="100%">
                            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                            {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
                        </Stack>
                        {toast.action && (<Toast.ActionTrigger>
                                {toast.action.label}
                        </Toast.ActionTrigger>)}
                        {toast.meta?.closable && <Toast.CloseTrigger />}
                    </Toast.Root>
                )}
            </ChakraToaster>
        </Portal>
    )
}