import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, ReactNode } from "react";

type InsertAndUpdateDialogProps = {
    open: boolean;
    onClose: () => void;
    updateRow: any;
    updateHandler: () => void;
    insertHandler: (formJson: { [k: string]: any; }) => void;
    insertContent: string;
    updateContent: string;
    loading: boolean;
};

export const InsertAndUpdateDialog = ({
    open,
    onClose,
    updateRow,
    updateHandler,
    insertHandler,
    insertContent,
    updateContent,
    loading,
    children
}: InsertAndUpdateDialogProps & { children: ReactNode }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    component: 'form',
                    onSubmit: (event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries((formData as any).entries());

                        if (updateRow) {
                            updateHandler();
                        } else {
                            insertHandler(formJson);
                        }
                    }
                }
            }}
        >
            <DialogTitle>{updateRow ? updateContent : insertContent}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" loading={loading}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

type InsertAndUpdateDialogTextFieldProps = {
    name: string;
    label: string;
    type: "text" | "number";
    value: any;
    updateRowChangeHandler: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const InsertAndUpdateDialogTextField = ({ name, label, type, value, updateRowChangeHandler }: InsertAndUpdateDialogTextFieldProps) => {
    return (
        <TextField
            margin="dense"
            id={name}
            name={name}
            label={label}
            type={type}
            value={value}
            onChange={updateRowChangeHandler}
            fullWidth
        />
    );
};