import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";
import { AuthApi } from "../../services/Api";
import { SupplierDataType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";

export default function AddSupplierScreen() {

    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [formData, setFormData] = useState<SupplierDataType>({
        name: "",
        phoneNumber: "",
        email: ""
    });

    const resetFormData = (): void => {
        setFormData({
            name: "",
            phoneNumber: "",
            email: ""
        });
    };

    const addSupplier = (): void => {
        setLoading(true);
        AuthApi.post("/suppliers/add", formData)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Supplier registered successfully."
                });
                resetFormData();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: err.response.data.message
                });
                console.error("Error adding data:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/suppliers">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h5" fontWeight="bold">Add Supplier</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Box component="form" action={addSupplier} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="supplierName"
                        name="supplierName"
                        label="Supplier Name"
                        value={formData.name}
                        sx={{ width: 400 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        autoFocus
                    />
                    <TextField
                        margin="dense"
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        value={formData.phoneNumber}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        value={formData.email}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                        loading={loading}
                        id="addBtn"
                    >
                        Add
                    </Button>
                </Box>
            </Box>
        </>
    );
}