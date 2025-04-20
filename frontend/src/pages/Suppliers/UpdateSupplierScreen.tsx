import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AuthApi } from "../../services/Api";
import { SupplierDataType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";

export default function UpdateSupplierScreen() {

    const { supplierId } = useParams();

    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [supplier, setSupplier] = useState<SupplierDataType>({
        name: "",
        phoneNumber: "",
        email: ""
    });

    const fetchSupplier = (): void => {
        AuthApi.get("/suppliers/get_one", {
            params: {
                supplierId: supplierId
            }
        })
            .then(res => {
                setSupplier(res.data);
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed fetching supplier."
                });
                console.error("Error fetching data:", err);
            });
    };

    const updateSupplier = (): void => {
        setLoading(true);
        AuthApi.put("/suppliers/update", supplier)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Supplier updated successfully."
                });
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: err.response.data.message
                });
                console.error("Error updating data:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSupplier();
    }, []);

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/suppliers">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h6" fontWeight="bold">Update Supplier</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Box component="form" action={updateSupplier} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="supplierName"
                        name="supplierName"
                        label="Supplier Name"
                        value={supplier.name}
                        sx={{ width: 400 }}
                        onChange={(e) => setSupplier(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        value={supplier.phoneNumber}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setSupplier(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        value={supplier.email}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setSupplier(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                        loading={loading}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        </>
    );
}