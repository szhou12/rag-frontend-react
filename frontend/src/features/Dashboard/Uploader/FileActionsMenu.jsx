import ActionsMenuLayout from "../ActionsMenuLayout";
// import EditFile from "./EditFile";
import DeleteFile from "./DeleteFile";

const FileActionsMenu = ({ file }) => {
    return (
        <ActionsMenuLayout>
            {/* <EditFile file={file} /> */}
            <DeleteFile id={file.id} />
        </ActionsMenuLayout>
    )
}

export default FileActionsMenu;