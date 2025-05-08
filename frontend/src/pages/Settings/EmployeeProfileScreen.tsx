import { Person2 } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardActions, CardContent, CardHeader, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthObjectType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";
import getDateTime from "../../services/DateTime";

export default function EmployeeProfile() {

    const [authObject, setAuthObject] = useState<AuthObjectType>();
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });

    useEffect(() => {
        setAuthObject(JSON.parse(localStorage.getItem("authObject") ?? '{}'));
    }, []);

    return (
        <>
            {/* Heading */}
            <Box my={2}>
                <Typography variant="h4" fontWeight="bold">Account & Settings</Typography>
                <Typography variant="caption" sx={{ color: "grey" }}>{getDateTime()}</Typography>
            </Box>

            {/* Alerts */}
            <BasicAlert
                alert={alert}
                onClose={() => setAlert(prev => ({ ...prev, open: false }))}
            />

            <Card sx={{ width: "50%", padding: 1, mt: 4 }}>
                <CardHeader
                    title="Profile"
                    sx={{
                        typography: {
                            fontWeight: "bold"
                        }
                    }}
                    slotProps={{
                        title: {
                            fontWeight: "bold"
                        }
                    }}
                />
                <CardContent>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ width: 48, height: 48 }}>
                            <Person2 />
                        </Avatar>
                        <Stack direction="column">
                            <Typography variant="h6">
                                {
                                    authObject?.employee ?
                                        authObject.employee.firstName + " " + authObject.employee.lastName
                                        :
                                        (authObject?.role === "ADMIN" ? "Admin" : "Employee")
                                }
                            </Typography>
                            <Typography variant="body2">{authObject?.username}</Typography>
                        </Stack>
                    </Stack>

                </CardContent>
                <CardActions>
                    <Box sx={{ mt: 2, mb: 1 }}>
                        <Link to="/settings/change_password">
                            <Button variant="contained">
                                Change Password
                            </Button>
                        </Link>
                    </Box>
                </CardActions>
            </Card>
        </>
    );
}