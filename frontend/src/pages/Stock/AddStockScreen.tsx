import { ArrowBack } from "@mui/icons-material";
import { Alert, Autocomplete, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthApi } from "../../services/Api";
import { ProductDataType, StockRecordType } from "../../types/types";

export default function AddStockScreen() {

    const [loading, setLoading] = useState<{ products: boolean, add: boolean }>({ products: false, add: false });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [products, setProducts] = useState<ProductDataType[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductDataType | null | undefined>(null);
    const [formData, setFormData] = useState<StockRecordType>({
        stockAmount: 0
    });

    const fetchProducts = () => {
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

    const addStockRecord = () => {
        setLoading(prev => ({ ...prev, add: true }));

        if (!selectedProduct) {
            setAlert({
                open: true,
                type: "error",
                message: "A product must be selected to add a stock record."
            });
            setLoading(prev => ({ ...prev, add: false }));
            return;
        }

        if (formData.stockAmount <= 0) {
            setAlert({
                open: true,
                type: "error",
                message: "Enter a valid stock amount."
            });
            setLoading(prev => ({ ...prev, add: false }));
            return;
        }

        formData.product = selectedProduct;

        AuthApi.post("/stock/add", formData)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Stock Record added successfully."
                });
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Adding stock record failed."
                });
                console.error("Error adding data:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, add: false }));
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/stock">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h6" fontWeight="bold">Add Stock</Typography>
            </Box>

            <Box component="form" action={addStockRecord} sx={{ px: 5 }}>
                {/* Alerts */}
                {alert.open && (
                    <Box sx={{ marginTop: 2 }}>
                        {alert.type == "success" && <Alert severity="success" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                        {alert.type == "error" && <Alert severity="error">{alert.message}</Alert>}
                    </Box>
                )}

                <Box sx={{ marginTop: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <Autocomplete
                        options={products}
                        getOptionLabel={(option) => option.name}
                        loading={loading.products}
                        renderInput={(params) => <TextField {...params} name="product" label="Product" />}
                        onChange={(_, value) => setSelectedProduct(value)}
                        value={selectedProduct}
                        sx={{ marginY: 1, width: 400 }}
                    />
                    <TextField
                        margin="dense"
                        id="stockAmount"
                        name="stockAmount"
                        label="Stock Amount"
                        type="number"
                        value={formData.stockAmount}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, stockAmount: parseInt(e.target.value) }))}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                        loading={loading.add}
                    >
                        Add
                    </Button>
                </Box>
            </Box>
        </>
    );
}