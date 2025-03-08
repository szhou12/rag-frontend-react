import { defineStyle } from '@chakra-ui/react'

/**
 * Floating label style for form inputs
 * Creates a label that floats above the input when focused or filled
 * @example
 * <Field.Root>
 *     <Box pos="relative" w="full">
 *         <Input 
 *             className="peer"
 *             placeholder=""
 *             // ...other props
 *         />
 *         <Field.Label css={floatingLabelStyle}>Email</Field.Label>
 *     </Box>
 * </Field.Root>
 */
export const floatingLabelStyle = defineStyle({
    pos: "absolute",
    bg: "bg",
    px: "0.5",
    top: "-3",
    insetStart: "2",
    fontWeight: "normal",
    pointerEvents: "none",
    transition: "position",
    _peerPlaceholderShown: {
        color: "ui.dim",
        top: "2.5",
        insetStart: "3",
    },
    _peerFocusVisible: {
        color: "ui.main",
        top: "-3",
        insetStart: "2",
    },
})