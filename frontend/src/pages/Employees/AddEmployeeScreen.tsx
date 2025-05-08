import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";
import { AuthApi } from "../../services/Api";
import { CredentialsType, EmployeeDataType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";

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
        email: "",
        salary: 0
    });

    const [makeSystemUser, setMakeSystemUser] = useState<boolean>(false);

    const [credentials, setCredentials] = useState<CredentialsType>({
        username: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const resetFormData = (): void => {
        setFormData({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            salary: 0
        });
        setMakeSystemUser(false);
        setCredentials({
            username: "",
            password: ""
        });
    };

    const addEmployee = (): void => {
        setLoading(true);
        AuthApi.post("/employees/add", {
            employee: formData,
            makeSystemUser: makeSystemUser,
            credentials: credentials
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Employee registered successfully."
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

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/employees">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h5" fontWeight="bold">Add Employee</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Box component="form" action={addEmployee} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="firstname"
                        name="firstname"
                        label="First Name"
                        value={formData.firstName}
                        sx={{ width: 400 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        autoFocus
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
                    <TextField
                        margin="dense"
                        id="salary"
                        name="salary"
                        label="Salary"
                        type="number"
                        value={formData.salary}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, salary: parseFloat(e.target.value) }))}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                value={makeSystemUser}
                                onChange={e => setMakeSystemUser(e.target.checked)}
                            />
                        }
                        label={<Typography>System User</Typography>}
                        sx={{ mt: 2 }}
                    />
                    {
                        makeSystemUser &&
                        <>
                            <TextField
                                margin="dense"
                                id="username"
                                name="username"
                                label="Username"
                                value={credentials.username}
                                sx={{ width: 400, mt: 2 }}
                                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                            />
                            <TextField
                                margin="dense"
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={credentials.password}
                                sx={{ width: 400, mt: 2 }}
                                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                                slotProps={{
                                    input: {
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword ? 'hide the password' : 'display the password'
                                                    }
                                                    onClick={() => setShowPassword(show => !show)}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                    },
                                }}
                            />
                        </>
                    }
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