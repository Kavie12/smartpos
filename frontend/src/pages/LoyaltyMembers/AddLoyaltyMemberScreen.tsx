import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Checkbox, FormControlLabel, IconButton, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router";
import { AuthApi } from "../../services/Api";
import { LoyaltyMemberDataType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";

export default function AddLoyaltyMemberScreen() {

    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [formData, setFormData] = useState<LoyaltyMemberDataType>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        points: 0
    });
    const [generateCard, setGenerateCard] = useState<boolean>(false);

    const resetFormData = (): void => {
        setFormData({
            firstName: "",
            lastName: "",
            phoneNumber: "",
            points: 0
        });
    };

    const addLoyaltyMember = (): void => {
        setLoading(true);
        AuthApi.post("/loyalty_members/add", {
            loyaltyMember: formData,
            generateCard: generateCard
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Loyalty member registered successfully."
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
                <Link to="/loyalty_members">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h5" fontWeight="bold">Add Loyalty Member</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Box component="form" action={addLoyaltyMember} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                value={generateCard}
                                onChange={e => setGenerateCard(e.target.checked)}
                            />
                        }
                        label={<Typography>Generate Loyalty Card</Typography>}
                        sx={{ mt: 2 }}
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