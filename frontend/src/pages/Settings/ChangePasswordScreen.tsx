import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import BasicAlert from "../../components/BasicAlert";
import { AuthApi } from "../../services/Api";
import { AuthObjectType } from "../../types/types";

export default function ChangePasswordScreen() {

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [authObject, setAuthObject] = useState<AuthObjectType>();

    const resetFormData = (): void => {
        setFormData({
            oldPassword: "",
            newPassword: ""
        });
    };

    const changePassword = (): void => {
        if (!authObject) {
            console.error("Auth object is not loaded properly.");
            return;
        }

        const requestBody = {
            username: authObject.username,
            ...formData
        };

        setLoading(true);
        AuthApi.post("/auth/change_password", requestBody)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Password changed successfully."
                });
                resetFormData();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: err.response.data.message
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        setAuthObject(JSON.parse(localStorage.getItem("authObject") ?? '{}'));
    }, []);

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/settings/profile">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h5" fontWeight="bold">Change Password</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                {/* Form */}
                <Box component="form" action={changePassword} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", rowGap: 2, mt: 4 }}>
                    <TextField
                        id="oldPassword"
                        label="Old Password"
                        variant="outlined"
                        type="password"
                        onChange={e => setFormData(prev => ({ ...prev, oldPassword: e.target.value }))}
                        value={formData.oldPassword}
                        sx={{
                            width: 400
                        }}
                    />
                    <TextField
                        id="newPassword"
                        label="New Password"
                        variant="outlined"
                        type="password"
                        onChange={e => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                        value={formData.newPassword}
                        sx={{
                            width: 400
                        }}
                    />
                    <Button
                        variant="contained"
                        sx={{ mt: 1 }}
                        type="submit"
                        id="saveBtn"
                        loading={loading}
                    >
                        Save
                    </Button>
                </Box >
            </Box>

        </>
    );
}