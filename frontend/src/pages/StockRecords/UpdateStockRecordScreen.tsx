import { ArrowBack } from "@mui/icons-material";
import { Autocomplete, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AuthApi } from "../../services/Api";
import { ProductDataType, StockRecordType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";

export default function UpdateStockRecordScreen() {

    const { recordId } = useParams();

    const [loading, setLoading] = useState<{ products: boolean, update: boolean }>({ products: false, update: false });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [products, setProducts] = useState<ProductDataType[]>([]);
    const [stockRecord, setStockRecord] = useState<StockRecordType>({
        stockAmount: 0
    });

    const fetchProducts = (): void => {
        setLoading(prev => ({ ...prev, products: true }));
        AuthApi.get("/products/get_all")
            .then(res => {
                setProducts(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed fetching products."
                });
            })
            .finally(() => setLoading(prev => ({ ...prev, products: false })));
    };

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
                fetchProducts();
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
        fetchProducts();
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
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Box sx={{ marginTop: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <Autocomplete
                        options={products}
                        getOptionLabel={(option) => option.name}
                        loading={loading.products}
                        renderInput={(params) => <TextField {...params} name="product" label="Product" />}
                        onChange={(_, value) => setStockRecord(prev => ({ ...prev, product: value }))}
                        value={products.find(product => product.id === stockRecord.product?.id) || null}
                        sx={{ marginY: 1, width: 400 }}
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