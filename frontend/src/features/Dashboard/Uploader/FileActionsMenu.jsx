import EditFile from "./EditFile";
import DeleteFile from "./DeleteFile";
import { ActionsMenuLayout } from "@/layouts/Dashboard/ActionsMenuLayout";

const FileActionsMenu = ({ file }) => {
    return (
        <ActionsMenuLayout>
            <EditFile file={file} />
            <DeleteFile id={file.id} />
        </ActionsMenuLayout>
    )
}

export default FileActionsMenu;