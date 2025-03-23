import EditWebpage from "./EditWebpage";
import DeleteWebpage from "./DeleteWebpage";
import { ActionsMenuLayout } from "@/layouts/Dashboard/ActionsMenuLayout";


const WebpageActionsMenu = ({ webpage }) => {
    return (
        <ActionsMenuLayout>
            <EditWebpage webpage={webpage} />
            <DeleteWebpage id={webpage.id} />
        </ActionsMenuLayout>
    )
}

export default WebpageActionsMenu;
