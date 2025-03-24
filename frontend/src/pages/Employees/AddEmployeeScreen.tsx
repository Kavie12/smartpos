import { ArrowBack } from "@mui/icons-material";
import { Alert, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";
import { AuthApi } from "../../services/Api";
import { EmployeeDataType } from "../../types/types";

export default function AddEmployeeScreen() {

    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [formData, setFormData] = useState<EmployeeDataType>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: ""
    });

    const addEmployee = () => {
        setLoading(true);
        AuthApi.post("/employees/add", formData)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Employee registered successfully."
                });
            })
            .catch(err => {
                console.error("Error adding data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed registering employee."
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>

            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/employees">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h6" fontWeight="bold">Add Employee</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                {alert.open && (
                    <Box sx={{ marginTop: 2 }}>
                        {alert.type == "success" && <Alert severity="success" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                        {alert.type == "error" && <Alert severity="error">{alert.message}</Alert>}
                    </Box>
                )}

                <Box component="form" action={addEmployee} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="firstname"
                        name="firstname"
                        label="First Name"
                        value={formData.firstName}
                        sx={{ width: 400 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="lastname"
                        name="lastname"
                        label="Last Name"
                        value={formData.lastName}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
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
                    >
                        Add
                    </Button>
                </Box>
            </Box>


        </>
    );
}