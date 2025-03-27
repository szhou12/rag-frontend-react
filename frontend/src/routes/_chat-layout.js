import { createFileRoute, redirect } from "@tanstack/react-router"
import { isLoggedIn } from "@/hooks/useAuth"
import { ChatPageLayout } from "@/layouts/Chat/ChatPageLayout"

export const Route = createFileRoute("/_chat")({
    component: ChatPageLayout,

    beforeLoad: async () => {
        if (!isLoggedIn()) {
            throw redirect({ 
                to: "/login" 
            })
        }
    },
})