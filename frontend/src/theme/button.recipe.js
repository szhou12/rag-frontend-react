import { defineRecipe } from "@chakra-ui/react"

export const buttonRecipe = defineRecipe({
    base: {
        fontWeight: "semibold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
    },
    variants: {
        variant: {
            primary: {
                backgroundColor: "colors.ui.main",
                color: "colors.ui.light",
                _hover: {
                    backgroundColor: "#00766C",
                },
                _disabled: {
                    backgroundColor: "colors.ui.main",
                    _hover: {
                        backgroundColor: "colors.ui.main",
                    },
                },
            },
            danger: {
                backgroundColor: "colors.ui.danger",
                color: "colors.ui.light",
                _hover: {
                    backgroundColor: "#E32727",
                }, 
            },
            dashed: {
                rounded: "2xl",
                borderWidth: "2px",
                borderStyle: "dashed",
                borderColor: "black",
                bg: "white", // button background color
                px: "6",
                py: "3",
                fontWeight: "semibold",
                textTransform: "uppercase",
                color: "black",
                _hover: {
                    transform: "translate(-4px, -4px)",
                    rounded: "md",
                    shadow: "4px 4px 0px black", // shadow color
                },
                _active: {
                    transform: "translate(0px, 0px)",
                    rounded: "2xl",
                    shadow: "none",
                },
            },
            text: {
                bg: "transparent",
                color: "colors.ui.dim",
                _hover: {
                    color: "colors.ui.dark",
                },
                _active: {
                    color: "colors.ui.dark",
                },
            },
        },
    },
    defaultVariants: {
        variant: "primary",
    },
})