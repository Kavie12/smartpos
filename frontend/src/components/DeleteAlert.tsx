import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

type DeleteAlertProps = {
    open: boolean;
    onClose: () => void;
    content: string;
    loading: boolean;
    deleteHanlder: () => void;
};

export default function DeleteAlert({ open, onClose, content, loading, deleteHanlder }: DeleteAlertProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Warning
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={deleteHanlder} color="error" loading={loading}>Delete</Button>
            </DialogActions>
        </Dialog>
    );
}