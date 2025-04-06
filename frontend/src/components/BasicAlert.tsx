import { Alert, Box } from "@mui/material";
import { BasicAlertType } from "../types/types";
import { useEffect } from "react";

export default function BasicAlert({ alert, onClose }: { alert: BasicAlertType, onClose: () => void }) {

    useEffect(() => {
        let alertTimeout: NodeJS.Timeout;

        if (alert.open) {
            alertTimeout = setTimeout(() => {
                onClose();
            }, 3000);
        }

        return () => {
            clearTimeout(alertTimeout);
        };
    }, [alert]);

    return (
        <>
            {alert.open && (
                <Box sx={{ my: 2 }}>
                    {alert.type == "success" && <Alert severity="success" onClose={onClose}>{alert.message}</Alert>}
                    {alert.type == "error" && <Alert severity="error" onClose={onClose}>{alert.message}</Alert>}
                </Box>
            )}
        </>
    )
}