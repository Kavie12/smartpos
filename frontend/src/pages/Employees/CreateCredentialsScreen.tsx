import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AuthApi } from "../../services/Api";
import { CredentialsType, EmployeeDataType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";

export default function CreateCredentialsScreen() {

    const { employeeId } = useParams();

    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [employee, setEmployee] = useState<EmployeeDataType>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        salary: 0
    });

    const [credentials, setCredentials] = useState<CredentialsType>({
        username: "",
        password: ""
    });

    const fetchEmployee = (): void => {
        AuthApi.get("/employees/get_one", {
            params: {
                employeeId: employeeId
            }
        })
            .then(res => {
                setEmployee(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Fetching employee failed."
                });
            });
    };

    const createCredentials = (): void => {
        setLoading(true);
        AuthApi.put("/employees/create_credentials", {
            employee: employee,
            makeSystemUser: true,
            credentials: credentials
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Credentials created successfully."
                });
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
        fetchEmployee();
    }, []);

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/employees">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h5" fontWeight="bold">Create Credentials</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Box component="form" action={createCredentials} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        value={employee.firstName + " " + employee.lastName}
                        sx={{ width: 400 }}
                        disabled
                    />
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
                        type="password"
                        value={credentials.password}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                        loading={loading}
                        id="updateBtn"
                    >
                        Create
                    </Button>
                </Box>
            </Box>


        </>
    );
}