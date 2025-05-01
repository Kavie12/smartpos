import { Download } from "@mui/icons-material";
import { Box, Card, CardActionArea, CardContent, Grid2, LinearProgress, Typography } from "@mui/material";
import BasicAlert from "../components/BasicAlert";
import { useState } from "react";
import { AuthApi } from "../services/Api";

export default function Reports() {

    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });

    const generateReport = (apiEndpoint: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>): void => {
        setLoading(true);
        AuthApi.get(apiEndpoint)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Report generated successfully at Document/SmartPOS."
                });
            })
            .catch(() => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed generating report."
                });
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                    <Typography variant="h6" fontWeight="bold">Reports</Typography>
                </Box>
            </Box>

            {/* Alerts */}
            <BasicAlert
                alert={alert}
                onClose={() => setAlert(prev => ({ ...prev, open: false }))}
            />

            <Grid2 container spacing={4} sx={{ my: 2 }}>
                <ReportButton
                    title="Stock Record Report"
                    description="Generate a report about products which has highest number of stock records"
                    generator={generateReport}
                    apiEndpoint="/stock_records/generate_report"
                />
                <ReportButton
                    title="Product Report"
                    description="Generate a report about products which has highest stock levels"
                    generator={generateReport}
                    apiEndpoint="/products/generate_report"
                />
                <ReportButton
                    title="Supplier Report"
                    description="Generate a report about suppliers who provides highest number of products"
                    generator={generateReport}
                    apiEndpoint="/suppliers/generate_report"
                />
                <ReportButton
                    title="Loyalty Member Report"
                    description="Generate a report about loyalty members who has highest amount of loyalty points"
                    generator={generateReport}
                    apiEndpoint="/loyalty_members/generate_report"
                />
                <ReportButton
                    title="Employee Report"
                    description="Generate a report about employees who has highest amount of salaries"
                    generator={generateReport}
                    apiEndpoint="/employees/generate_report"
                />
            </Grid2>
        </>
    );
}

const ReportButton = ({ title, description, generator, apiEndpoint }:
    {
        title: string,
        description: string,
        generator: (apiRoute: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => void,
        apiEndpoint: string
    }
) => {

    const [loading, setLoading] = useState<boolean>(false);

    const generateReport = () => {
        generator(apiEndpoint, setLoading);
    }

    return (
        <Grid2 size={3}>
            <Card sx={{ maxWidth: 345 }}>
                {loading ? <LinearProgress /> : null}
                <CardActionArea onClick={generateReport}>
                    <CardContent sx={{ padding: 3 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Typography variant="h6" component="div">
                                {title}
                            </Typography>
                            <Download />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                            {description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid2>
    );
};