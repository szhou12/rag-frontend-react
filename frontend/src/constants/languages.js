import { createListCollection } from "@chakra-ui/react"

export const languages = createListCollection({
    items: [
        { 
            label: "English", 
            value: "en",
         },
        { 
            label: "中文", 
            value: "zh",
        },
    ],
})