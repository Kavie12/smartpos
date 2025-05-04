import { ArrowBack } from "@mui/icons-material";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AuthApi } from "../../services/Api";
import { LoyaltyMemberDataType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";

export default function UpdateLoyaltyMemberScreen() {

    const { id } = useParams();

    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [loyaltyMember, setLoyaltyMember] = useState<LoyaltyMemberDataType>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        points: 0
    });

    const fetchLoyaltyMember = (): void => {
        AuthApi.get("/loyalty_members/get_one", {
            params: {
                id: id
            }
        })
            .then(res => {
                setLoyaltyMember(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Fetching loyalty member failed."
                });
            });
    };

    const updateLoyaltyMember = (): void => {
        setLoading(true);
        AuthApi.put("/loyalty_members/update", loyaltyMember)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Loyalty member updated successfully."
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
        fetchLoyaltyMember();
    }, []);

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/loyalty_members">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h5" fontWeight="bold">Update Loyalty Member</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Box component="form" action={updateLoyaltyMember} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="firstname"
                        name="firstname"
                        label="First Name"
                        value={loyaltyMember.firstName}
                        sx={{ width: 400 }}
                        onChange={(e) => setLoyaltyMember(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="lastname"
                        name="lastname"
                        label="Last Name"
                        value={loyaltyMember.lastName}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setLoyaltyMember(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        value={loyaltyMember.phoneNumber}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setLoyaltyMember(prev => ({ ...prev, phoneNumber: e.target.value }))}
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