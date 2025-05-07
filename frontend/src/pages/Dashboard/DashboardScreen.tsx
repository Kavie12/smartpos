import { Box, Card, CardActionArea, CardContent, Grid2, Stack, Typography } from "@mui/material";
import { useState } from "react";
import BasicAlert from "../../components/BasicAlert";
import getDateTime from "../../services/DateTime";
import { AddBox, Inventory, LocalShipping, People, ShoppingCart, Work } from "@mui/icons-material";
import { useNavigate } from "react-router";

export default function DashboardScreen() {


    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });

    return (
        <>
            {/* Heading */}
            <Box my={2}>
                <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
                <Typography variant="caption" sx={{ color: "grey" }}>{getDateTime()}</Typography>
            </Box>

            {/* Content */}
            <Box mt={4}>
                <Grid2 container spacing={4}>
                    <DashboardCard
                        title="Billing"
                        subtitle="View & create bills"
                        icon={<ShoppingCart color="primary" fontSize="large" />}
                        path="/billing"
                    />
                    <DashboardCard
                        title="Stock"
                        subtitle="Manage stock records"
                        icon={<AddBox color="primary" fontSize="large" />}
                        path="/stock_records"
                    />
                    <DashboardCard
                        title="Products"
                        subtitle="Add & edit products"
                        icon={<Inventory color="primary" fontSize="large" />}
                        path="/products"
                    />
                    <DashboardCard
                        title="Suppliers"
                        subtitle="Manage suppliers"
                        icon={<LocalShipping color="primary" fontSize="large" />}
                        path="/suppliers"
                    />
                    <DashboardCard
                        title="Loyalty Members"
                        subtitle="View loyalty members"
                        icon={<People color="primary" fontSize="large" />}
                        path="/loyalty_members"
                    />
                    <DashboardCard
                        title="Employees"
                        subtitle="Manage employees"
                        icon={<Work color="primary" fontSize="large" />}
                        path="/employees"
                    />
                </Grid2>
            </Box>

            {/* Alerts */}
            <BasicAlert
                alert={alert}
                onClose={() => setAlert(prev => ({ ...prev, open: false }))}
            />
        </>
    );
}

type DashboardCardType = {
    title: string;
    subtitle: string;
    icon: any;
    path: string;
};

const DashboardCard = ({ title, subtitle, icon, path }: DashboardCardType) => {

    const navigate = useNavigate();

    return (
        <Grid2 size={3}>
            <Card sx={{ height: 180 }}>
                <CardActionArea sx={{ height: "100%" }} onClick={() => navigate(path)}>
                    <CardContent>
                        <Stack alignItems="center" spacing={1}>
                            {icon}
                            <Stack textAlign="center" spacing={0.5}>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    {title}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                    {subtitle}
                                </Typography>
                            </Stack>
                        </Stack>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid2>
    );
};