import { ArrowBack } from "@mui/icons-material";
import { Alert, Autocomplete, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AuthApi } from "../../services/Api";
import { ProductDataType, SupplierDataType } from "../../types/types";

export default function AddProductScreen() {

    const [loading, setLoading] = useState<{ suppliers: boolean, add: boolean }>({ suppliers: false, add: false });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [suppliers, setSuppliers] = useState<SupplierDataType[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierDataType | null | undefined>(null);
    const [formData, setFormData] = useState<ProductDataType>({
        barcode: "",
        name: "",
        wholesalePrice: 0,
        retailPrice: 0,
        stockLevel: 0
    });

    const fetchSuppliers = () => {
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

    const addProduct = () => {
        setLoading(prev => ({ ...prev, add: true }));

        if (!selectedSupplier) {
            setAlert({
                open: true,
                type: "error",
                message: "A supplier must be selected to add a product."
            });
            setLoading(prev => ({ ...prev, add: false }));
            return;
        }

        formData.supplier = selectedSupplier;

        AuthApi.post("/products/add", formData)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Product added successfully."
                });
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Adding product failed."
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
                {alert.open && (
                    <Box sx={{ marginTop: 2 }}>
                        {alert.type == "success" && <Alert severity="success" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                        {alert.type == "error" && <Alert severity="error">{alert.message}</Alert>}
                    </Box>
                )}

                <Box component="form" action={addProduct} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="barcode"
                        name="barcode"
                        label="Barcode"
                        value={formData.barcode}
                        sx={{ width: 400 }}
                        onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                    />
                    <Autocomplete
                        options={suppliers}
                        getOptionLabel={(option) => option.name}
                        loading={loading.suppliers}
                        renderInput={(params) => <TextField {...params} name="supplier" label="Supplier" />}
                        onChange={(_, value) => setSelectedSupplier(value)}
                        value={selectedSupplier}
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