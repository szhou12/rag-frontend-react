
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";
import { ActionsMenuLayout } from "@/layouts/Dashboard/ActionsMenuLayout";

const UserActionsMenu = ({ user, disabled }) => {
    return (
        <ActionsMenuLayout disabled={disabled}>
            <EditUser user={user} />
            <DeleteUser id={user.id} />
        </ActionsMenuLayout>
    )
}

export default UserActionsMenu;