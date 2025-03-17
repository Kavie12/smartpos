import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

type AlertDialogProps = {
    open: boolean;
    onClose: () => void;
    success: boolean;
    successContent: string;
    errorContent: string;
};

export default function AlertDialog({ open, onClose, success, successContent, errorContent }: AlertDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {success ? "Success" : "Error"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {success ? successContent : errorContent}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>OK</Button>
            </DialogActions>
        </Dialog>
    );
}