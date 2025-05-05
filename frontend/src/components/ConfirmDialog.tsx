import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

type ConfirmDialogType = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
};

export default function DeleteDialog({ open, onClose, onConfirm, message }: ConfirmDialogType) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Confirm
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} id="deleteDialogCancelBtn">Cancel</Button>
                <Button onClick={onConfirm} color="error" id="deleteDialogConfirmBtn">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}