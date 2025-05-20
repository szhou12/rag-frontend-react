import { createFileRoute } from "@tanstack/react-router"
import IndexPage from "@/pages/Chat/IndexPage"
import Chatbot from "@/pages/Chat/Chatbot"

export const Route = createFileRoute("/chat")({
    component: Chatbot,
})
