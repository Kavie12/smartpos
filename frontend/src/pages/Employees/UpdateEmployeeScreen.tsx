import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AuthApi } from "../../services/Api";
import { EmployeeDataType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";

export default function UpdateEmployeeScreen() {

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

    const updateEmployee = (): void => {
        setLoading(true);
        AuthApi.put("/employees/update", employee)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Employee updated successfully."
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

            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/employees">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h6" fontWeight="bold">Update Employee</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Box component="form" action={updateEmployee} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="firstname"
                        name="firstname"
                        label="First Name"
                        value={employee.firstName}
                        sx={{ width: 400 }}
                        onChange={(e) => setEmployee(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="lastname"
                        name="lastname"
                        label="Last Name"
                        value={employee.lastName}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setEmployee(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        value={employee.phoneNumber}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setEmployee(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email"
                        value={employee.email}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setEmployee(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="salary"
                        name="salary"
                        label="Salary"
                        value={employee.salary}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setEmployee(prev => ({ ...prev, salary: (e.target.value ? parseFloat(e.target.value) : 0) }))}
                    />
                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                        loading={loading}
                        id="updateBtn"
                    >
                        Update
                    </Button>
                </Box>
            </Box>


        </>
    );
}