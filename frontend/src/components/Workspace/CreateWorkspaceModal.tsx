import {
    Modal,
    Input
}
    from "antd";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CreateWorkspaceModal({
    open,
    onClose
}: Props) {

    return (

        <Modal
            title="Create Workspace"
            open={open}
            onCancel={onClose}
        >

            <Input
                placeholder="Workspace Name"
            />

        </Modal>

    );

}