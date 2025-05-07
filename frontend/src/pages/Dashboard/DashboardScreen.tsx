import { Box, Card, CardActionArea, CardContent, Grid2, Stack, Typography } from "@mui/material";
import { useState } from "react";
import BasicAlert from "../../components/BasicAlert";
import getDateTime from "../../services/DateTime";
import { Category, Inventory, LocalShipping, People, ShoppingCart, Work } from "@mui/icons-material";
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
                    <Grid2 size={4}>
                        <DashboardCard
                            title="Billing"
                            subtitle="View & create bills"
                            icon={<ShoppingCart fontSize="large" />}
                            path="/billing"
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <DashboardCard
                            title="Stock"
                            subtitle="Manage stock records"
                            icon={<Inventory fontSize="large" />}
                            path="/stock_records"
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <DashboardCard
                            title="Products"
                            subtitle="Add & edit products"
                            icon={<Category fontSize="large" />}
                            path="/products"
                        />
                    </Grid2>

                    <Grid2 size={4}>
                        <DashboardCard
                            title="Suppliers"
                            subtitle="Manage suppliers"
                            icon={<LocalShipping fontSize="large" />}
                            path="/suppliers"
                        />
                    </Grid2>

                    <Grid2 size={4}>
                        <DashboardCard
                            title="Loyalty Members"
                            subtitle="View loyalty members"
                            icon={<People fontSize="large" />}
                            path="/loyalty_members"
                        />
                    </Grid2>

                    <Grid2 size={4}>
                        <DashboardCard
                            title="Employees"
                            subtitle="Manage employees"
                            icon={<Work fontSize="large" />}
                            path="/employees"
                        />
                    </Grid2>
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
        <Card sx={{ height: 200 }}>
            <CardActionArea sx={{ height: "100%" }} onClick={() => navigate(path)}>
                <CardContent>
                    <Stack alignItems="center" spacing={2}>
                        {icon}
                        <Stack textAlign="center" spacing={1}>
                            <Typography variant="h5" fontWeight="bold">
                                {title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {subtitle}
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};