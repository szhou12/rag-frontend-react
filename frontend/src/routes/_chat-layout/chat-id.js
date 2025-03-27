import { createFileRoute } from "@tanstack/react-router"
import ChatPage from "@/pages/Chat/ChatPage"

export const Route = createFileRoute("/c/$chatId")({
    component: ChatPage,
    // loader: async ({ params }) => {
    //     return { chatId: params.chatId }
    // },
})
