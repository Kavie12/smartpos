import { Download, ExpandMore, OpenInNew } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActionArea, CardContent, Grid2, LinearProgress, Stack, Typography } from "@mui/material";
import BasicAlert from "../../components/BasicAlert";
import { ReactNode, useState } from "react";
import { AuthApi } from "../../services/Api";

export default function Reports() {

    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });

    const [accordionExpanded, setAccordionExpanded] = useState<string | false>(false);

    const handleAccordionChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setAccordionExpanded(isExpanded ? panel : false);
    };

    const generateReport = (apiEndpoint: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>): void => {
        setLoading(true);
        AuthApi.get(apiEndpoint)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Report generated successfully."
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

    const openReportFolder = (): void => {
        AuthApi.get("/utils/open_report_dir")
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: err.response.data.message
                });
            })
    }

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                    <Typography variant="h5" fontWeight="bold">Reports</Typography>
                </Box>
                <Button startIcon={<OpenInNew />} id="openReportFolderBtn" onClick={openReportFolder}>
                    Open Report Folder
                </Button>
            </Box>

            {/* Alerts */}
            <BasicAlert
                alert={alert}
                onClose={() => setAlert(prev => ({ ...prev, open: false }))}
            />

            <Box>
                {/* Billling Reports */}
                <ReportAccordion id="billing_report_panel" title="Billing Reports" expanded={accordionExpanded} handleAccordionChange={handleAccordionChange}>
                    <ReportButton
                        title="All Bills"
                        description="Generate a table of all bills."
                        generator={generateReport}
                        apiEndpoint="/billing/generate_table_report"
                    />
                    <ReportButton
                        title="Top Bills by Price"
                        description="Generate a bar chart on top 15 bills which has highest amount of price."
                        generator={generateReport}
                        apiEndpoint="/billing/generate_chart"
                    />
                </ReportAccordion>

                {/* Product Reports */}
                <ReportAccordion id="product_report_panel" title="Product Reports" expanded={accordionExpanded} handleAccordionChange={handleAccordionChange}>
                    <ReportButton
                        title="All Products"
                        description="Generate a table of all products."
                        generator={generateReport}
                        apiEndpoint="/products/generate_table_report"
                    />
                    <ReportButton
                        title="Top Products by Stock Level"
                        description="Generate a bar chart on top 5 products which has highest profit."
                        generator={generateReport}
                        apiEndpoint="/products/generate_chart"
                    />
                </ReportAccordion>

                {/* Stock Record Reports */}
                <ReportAccordion id="stock_report_panel" title="Stock Record Reports" expanded={accordionExpanded} handleAccordionChange={handleAccordionChange}>
                    <ReportButton
                        title="All Stock Records"
                        description="Generate a table of all stock records."
                        generator={generateReport}
                        apiEndpoint="/stock_records/generate_table_report"
                    />
                    <ReportButton
                        title="Top Products by Stock Record Count"
                        description="Generate a pie chart on top 5 products which has highest number of stock records."
                        generator={generateReport}
                        apiEndpoint="/stock_records/generate_chart"
                    />
                </ReportAccordion>

                {/* Supplier Reports */}
                <ReportAccordion id="supplier_report_panel" title="Supplier Reports" expanded={accordionExpanded} handleAccordionChange={handleAccordionChange}>
                    <ReportButton
                        title="All Suppliers"
                        description="Generate a table of all suppliers."
                        generator={generateReport}
                        apiEndpoint="/suppliers/generate_table_report"
                    />
                    <ReportButton
                        title="Top Suppliers by Product Count"
                        description="Generate a pie chart on top 5 suppliers who provides highest number of products."
                        generator={generateReport}
                        apiEndpoint="/suppliers/generate_chart"
                    />
                </ReportAccordion>

                {/* Loyalty Member Reports */}
                <ReportAccordion id="loyalty_member_report_panel" title="Loyalty Member Reports" expanded={accordionExpanded} handleAccordionChange={handleAccordionChange}>
                    <ReportButton
                        title="All Loyalty Members"
                        description="Generate a table of all loyalty members."
                        generator={generateReport}
                        apiEndpoint="/loyalty_members/generate_table_report"
                    />
                    <ReportButton
                        title="Top Loyalty Members by Loyalty Points"
                        description="Generate a bar chart on top 5 loyalty members who has highest amount of loyalty points."
                        generator={generateReport}
                        apiEndpoint="/loyalty_members/generate_chart"
                    />
                </ReportAccordion>

                {/* Employee Reports */}
                <ReportAccordion id="employee_report_panel" title="Employee Reports" expanded={accordionExpanded} handleAccordionChange={handleAccordionChange}>
                    <ReportButton
                        title="All Employees"
                        description="Generate a table of all employees."
                        generator={generateReport}
                        apiEndpoint="/employees/generate_table_report"
                    />
                    <ReportButton
                        title="Top Employees by Salary"
                        description="Generate a bar chart on top 5 employees who has highest amount of salaries."
                        generator={generateReport}
                        apiEndpoint="/employees/generate_chart"
                    />
                </ReportAccordion>
            </Box>
        </>
    );
}

const ReportAccordion = ({ id, title, expanded, handleAccordionChange, children }: {
    id: string,
    title: string,
    expanded: string | false,
    handleAccordionChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void
    children: ReactNode,
}) => {
    return (
        <Accordion expanded={expanded === id} onChange={handleAccordionChange(id)}>
            <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={id}
                id={id}
            >
                <Typography component="span">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid2 container spacing={4} alignItems="stretch">
                    {children}
                </Grid2>
            </AccordionDetails>
        </Accordion>
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
            <Card sx={{ maxWidth: 345, backgroundColor: "whitesmoke", height: "100%" }}>
                {loading ? <LinearProgress /> : null}
                <CardActionArea onClick={generateReport} sx={{ height: "100%" }}>
                    <CardContent sx={{ padding: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={4}>
                            <Typography variant="h6">
                                {title}
                            </Typography>
                            <Download />
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                            {description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid2>
    );
};