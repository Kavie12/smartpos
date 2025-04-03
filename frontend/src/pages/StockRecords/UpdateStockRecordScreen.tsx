import { ArrowBack } from "@mui/icons-material";
import { Alert, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AuthApi } from "../../services/Api";
import { StockRecordType } from "../../types/types";

export default function UpdateStockRecordScreen() {

    const { recordId } = useParams();

    const [loading, setLoading] = useState<{ products: boolean, update: boolean }>({ products: false, update: false });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [stockRecord, setStockRecord] = useState<StockRecordType>({
        stockAmount: 0
    });

    const fetchStockRecord = (): void => {
        AuthApi.get("/stock_records/get_one", {
            params: {
                recordId: recordId
            }
        })
            .then(res => {
                setStockRecord(res.data);
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed fetching stock record."
                });
                console.error("Error fetching data:", err);
            });
    };

    const updateStockRecord = (): void => {
        setLoading(prev => ({ ...prev, update: true }));

        if (!stockRecord.product) {
            setAlert({
                open: true,
                type: "error",
                message: "A product must be selected to add a stock record."
            });
            setLoading(prev => ({ ...prev, update: false }));
            return;
        }

        if (stockRecord.stockAmount <= 0) {
            setAlert({
                open: true,
                type: "error",
                message: "Enter a valid stock amount."
            });
            setLoading(prev => ({ ...prev, update: false }));
            return;
        }

        AuthApi.put("/stock_records/update", stockRecord)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Stock Record updated successfully."
                });
                fetchStockRecord();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Updating stock record failed."
                });
                console.error("Error updating data:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, update: false }));
            });
    };

    useEffect(() => {
        fetchStockRecord();
    }, []);

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/stock_records">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h6" fontWeight="bold">Update Stock Record</Typography>
            </Box>

            <Box component="form" action={updateStockRecord} sx={{ px: 5 }}>
                {/* Alerts */}
                {alert.open && (
                    <Box sx={{ my: 2 }}>
                        {alert.type == "success" && <Alert severity="success" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                        {alert.type == "error" && <Alert severity="error" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                    </Box>
                )}

                <Box sx={{ marginTop: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="productName"
                        name="productName"
                        label="Product Name"
                        value={stockRecord.product?.name || ""}
                        sx={{ width: 400 }}
                        disabled
                    />
                    <TextField
                        margin="dense"
                        id="stockAmount"
                        name="stockAmount"
                        label="Stock Amount"
                        type="number"
                        value={stockRecord.stockAmount}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setStockRecord(prev => ({ ...prev, stockAmount: parseInt(e.target.value) }))}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                        loading={loading.update}
                    >
                        Update
                    </Button>
                </Box>
            </Box>
        </>
    );
}