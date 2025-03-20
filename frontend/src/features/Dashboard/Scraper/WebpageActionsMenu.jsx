import ActionsMenuLayout from "../ActionsMenuLayout";
import EditWebpage from "./EditWebpage";
import DeleteWebpage from "./DeleteWebpage";

const WebpageActionsMenu = ({ webpage }) => {
    return (
        <ActionsMenuLayout>
            <EditWebpage webpage={webpage} />
            <DeleteWebpage id={webpage.id} />
        </ActionsMenuLayout>
    )
}

export default WebpageActionsMenu;
