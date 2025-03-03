"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { system } from "../../theme"
import { ColorModeProvider } from "./color-mode"
import { Toaster } from "./toaster"

/**
 * Root provider component that sets up the application infrastructure.
 * 
 * This component combines multiple providers to enable:
 * - Chakra UI v3 theming with custom tokens and recipes
 * - Light/dark mode functionality with defaultTheme="light"
 * - Toast notifications system
 * 
 * ChakraProvider value={system}: applies the custom theme to all components.
 * ColorModeProvider defaultTheme="light": sets up theme switching capabilities.
 * Toaster: sets up toast notification system.
 * 
 * All app components wrapped in this provider will have access to:
 * - Custom theme with tokens and recipes   
 * - Light/dark mode functionality
 * - Toast notifications
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Application components to be wrapped
 * @returns {JSX.Element} Provider component with all necessary context providers
 */
export function CustomProvider(props) {
    return (
        <ChakraProvider value={system}>
            <ColorModeProvider defaultTheme="light">
                {props.children}
            </ColorModeProvider>
            <Toaster />
        </ChakraProvider>
    )
}