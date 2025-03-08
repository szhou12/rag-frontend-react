import { createSystem, defaultConfig } from "@chakra-ui/react"
import { buttonRecipe } from "./theme/button.recipe"
import { tabsRecipe } from "./theme/tabs.recipe"

export const system = createSystem(defaultConfig, {
    globalCss: {
        body: {
            margin: 0,
            padding: 0,
        },
    },
    theme: {
        tokens: {
            colors: {
                ui: {
                    main: { value: "teal" },
                    secondary: { value: "#EDF2F7" },
                    success: { value: "#48BB78" },
                    danger: { value: "#E53E3E" },
                    light: { value: "#FAFAFA" },
                    dark: { value: "#1A202C" },
                    darkSlate: { value: "#252D3D" },
                    dim: { value: "#A0AEC0" },
                    navy: { value: "#1565C0" },
                    coral: { value: "#FF7043"}
                },
            },
        },
        recipes: {
            button: buttonRecipe,
            tabs: tabsRecipe,
        },
    },
})

export default system