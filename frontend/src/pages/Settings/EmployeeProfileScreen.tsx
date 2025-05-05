import { Person2 } from "@mui/icons-material";
import { Avatar, Box, Button, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthObjectType, EmployeeDataType } from "../../types/types";
import { AuthApi } from "../../services/Api";
import BasicAlert from "../../components/BasicAlert";

export default function EmployeeProfile() {

    const nameOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours > 12 ? "PM" : "AM";

    const [authObject, setAuthObject] = useState<AuthObjectType>();
    const [userDetails, setUserDetails] = useState<{
        employee: EmployeeDataType,
        username: string,
        role: string
    }>();
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });

    const fetchUserDetails = (): void => {
        if (!authObject) {
            console.error("Auth object is not loaded properly.");
            return;
        }

        AuthApi.get("/auth/get_user_details", {
            params: {
                username: authObject.username
            }
        })
            .then(res => {
                setUserDetails(res.data);
                console.log(res.data)
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed fetching user details."
                });
            });
    };

    useEffect(() => {
        setAuthObject(JSON.parse(localStorage.getItem("auth") ?? '{}'));
    }, []);

    useEffect(() => {
        if (authObject?.username) {
            fetchUserDetails();
        }
    }, [authObject]);

    return (
        <>
            {/* Heading */}
            <Box my={2}>
                <Typography variant="h4" fontWeight="bold">Account & Settings</Typography>
                <Typography variant="caption" sx={{ color: "grey" }}>{hours}:{minutes} {amOrPm}, {day} {nameOfMonths[month]} {year}</Typography>
            </Box>

            {/* Alerts */}
            <BasicAlert
                alert={alert}
                onClose={() => setAlert(prev => ({ ...prev, open: false }))}
            />

            {/* Sections */}
            <Stack direction="column" spacing={8} mt={4}>

                {/* Section 1 */}
                <Section sectionName="General">
                    <Card sx={{ width: "50%", padding: 1 }}>
                        <CardHeader
                            title="Basic Details"
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
                                            userDetails?.employee ?
                                                userDetails.employee.firstName + " " + userDetails.employee.lastName
                                                :
                                                (userDetails?.role === "ADMIN" ? "Admin" : "Employee")
                                        }
                                    </Typography>
                                    <Typography variant="body2">{userDetails?.username}</Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Section>

                {/* Section 2 */}
                <Section sectionName="Settings">
                    <Card sx={{ width: "50%", padding: 1 }}>
                        <CardHeader
                            title="Security"
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
                            <Link to="/settings/change_password">
                                <Button variant="contained">
                                    Change Password
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </Section>

            </Stack >
        </>
    );
}

const Section = ({ sectionName, children }: { sectionName: string, children: ReactNode }) => {
    return (
        <Box>
            <Typography sx={{ fontSize: "10", color: "grey", textDecoration: "none" }}>{sectionName}</Typography>
            <Divider sx={{ mt: 0.5 }} />

            <Box sx={{ mt: 2 }}>
                {children}
            </Box>
        </Box>
    );
}