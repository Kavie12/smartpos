import { ArrowBack } from "@mui/icons-material";
import { Autocomplete, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthApi } from "../../services/Api";
import { ProductDataType, SupplierDataType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";

export default function AddProductScreen() {

    const [loading, setLoading] = useState<{ suppliers: boolean, add: boolean }>({ suppliers: false, add: false });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [suppliers, setSuppliers] = useState<SupplierDataType[]>([]);
    const [formData, setFormData] = useState<ProductDataType>({
        barcode: "",
        name: "",
        wholesalePrice: 0,
        retailPrice: 0,
        stockLevel: 0
    });

    const resetFormData = (): void => {
        setFormData({
            barcode: "",
            name: "",
            wholesalePrice: 0,
            retailPrice: 0,
            stockLevel: 0
        });
    };

    const fetchSuppliers = (): void => {
        setLoading(prev => ({ ...prev, suppliers: true }));
        AuthApi.get("/suppliers/get_all")
            .then(res => {
                setSuppliers(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed fetching suppliers."
                });
            })
            .finally(() => setLoading(prev => ({ ...prev, suppliers: false })));
    };

    const addProduct = (): void => {
        setLoading(prev => ({ ...prev, add: true }));

        AuthApi.post("/products/add", formData)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Product added successfully."
                });
                resetFormData();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: err.response.data.message
                });
                console.error("Error adding data:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, add: false }));
            });
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    return (
        <>

            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/products">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h6" fontWeight="bold">Add Product</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Box component="form" action={addProduct} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="barcode"
                        name="barcode"
                        label="Barcode"
                        value={formData.barcode}
                        sx={{ width: 400 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                        autoFocus
                    />
                    <Autocomplete
                        options={suppliers}
                        getOptionLabel={(option) => option.name}
                        loading={loading.suppliers}
                        renderInput={(params) => <TextField {...params} name="supplier" label="Supplier" />}
                        onChange={(_, value) => setFormData(prev => ({ ...prev, supplier: value }))}
                        value={formData.supplier}
                        sx={{ width: 400, mt: 2 }}
                    />
                    <TextField
                        margin="dense"
                        id="productName"
                        name="productName"
                        label="Product Name"
                        value={formData.name}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="wholesalePrice"
                        name="wholesalePrice"
                        label="Wholesale Price"
                        type="number"
                        value={formData.wholesalePrice}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, wholesalePrice: parseFloat(e.target.value) }))}
                    />
                    <TextField
                        margin="dense"
                        id="retailPrice"
                        name="retailPrice"
                        label="Retail Price"
                        type="number"
                        value={formData.retailPrice}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, retailPrice: parseFloat(e.target.value) }))}
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