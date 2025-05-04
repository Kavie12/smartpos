import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

type DeleteDialogType = {
    open: boolean;
    onClose: () => void;
    onDelete: () => void;
    loading: boolean;
    message: string;
};

export default function DeleteDialog({ open, onClose, onDelete, loading, message }: DeleteDialogType) {
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
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} id="deleteDialogCancelBtn">Cancel</Button>
                <Button onClick={onDelete} color="error" loading={loading} id="deleteDialogConfirmBtn">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}