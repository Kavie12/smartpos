import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { ChangeEvent, FormEvent, InputHTMLAttributes, ReactNode } from "react";

type InsertAndUpdateDialogProps = {
    open: boolean;
    onClose: () => void;
    formData: { data: any, isUpdate: boolean } | null;
    updateHandler: () => void;
    insertHandler: () => void;
    insertContent: string;
    updateContent: string;
    loading: boolean;
};

export const InsertAndUpdateDialog = ({
    open,
    onClose,
    formData,
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

                        if (formData?.isUpdate) {
                            updateHandler();
                        } else {
                            insertHandler();
                        }
                    }
                }
            }}
        >
            <DialogTitle>{formData?.isUpdate ? updateContent : insertContent}</DialogTitle>
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
    type: InputHTMLAttributes<unknown>['type'];
    value: any;
    formDataChangeHandler: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const InsertAndUpdateDialogTextField = ({
    name, label, type, value, formDataChangeHandler
}: InsertAndUpdateDialogTextFieldProps) => {
    return (
        <TextField
            margin="dense"
            id={name}
            name={name}
            label={label}
            type={type}
            value={value}
            onChange={formDataChangeHandler}
            fullWidth
        />
    );
};