import { createListCollection } from "@chakra-ui/react"

export const roles = createListCollection({
    items: [
        { 
            label: "Client", 
            value: "client",
            description: "Access to Chat Page",
         },
        { 
            label: "Staff", 
            value: "staff",
            description: "Access to Chat Page and Dashboard",
        },
        { 
            label: "Admin", 
            value: "admin",
            description: "Access to Chat Page, Dashboard, and Users Management",
        },
    ],
})