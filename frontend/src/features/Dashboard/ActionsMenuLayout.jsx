import { IconButton } from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MenuContent, MenuRoot, MenuTrigger } from "@/components/ui/menu"

const ActionsMenuLayout = ({ children, disabled = false }) => {
    return (
        <MenuRoot>
            <MenuTrigger asChild>
                <IconButton variant="ghost" color="inherit" disabled={disabled}>
                    <BsThreeDotsVertical />
                </IconButton>
            </MenuTrigger>
            <MenuContent>
                {children}
            </MenuContent>
        </MenuRoot>
    )
}

export default ActionsMenuLayout;