import { Alert, Box } from "@mui/material";
import { BasicAlertType } from "../types/types";
import { useEffect } from "react";

export default function BasicAlert({ alert, onClose }: { alert: BasicAlertType, onClose: () => void }) {

    useEffect(() => {
        let alertTimeout: NodeJS.Timeout;

        if (alert.open) {
            alertTimeout = setTimeout(() => {
                onClose();
            }, 5000);
        }

        return () => {
            clearTimeout(alertTimeout);
        };
    }, [alert]);

    return (
        <>
            {alert.open && (
                <Box sx={{ my: 2 }}>
                    {alert.type && <Alert severity={alert.type} onClose={onClose}>{alert.message}</Alert>}
                </Box>
            )}
        </>
    )
}