import { ArrowBack } from "@mui/icons-material";
import { Autocomplete, Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AuthApi } from "../../services/Api";
import { ProductDataType, SupplierDataType } from "../../types/types";
import BasicAlert from "../../components/BasicAlert";

export default function UpdateProductScreen() {

    const { productId } = useParams();

    const [loading, setLoading] = useState<{ suppliers: boolean, update: boolean }>({ suppliers: false, update: false });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [suppliers, setSuppliers] = useState<SupplierDataType[]>([]);
    const [product, setProduct] = useState<ProductDataType>({
        barcode: "",
        name: "",
        wholesalePrice: 0,
        retailPrice: 0,
        stockLevel: 0
    });

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

    const fetchProduct = (): void => {
        AuthApi.get("/products/get_one", {
            params: {
                productId: productId
            }
        })
            .then(res => {
                setProduct(res.data);
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed fetching product."
                });
                console.error("Error fetching data:", err);
            });
    };

    const updateProduct = (): void => {
        setLoading(prev => ({ ...prev, update: true }));

        if (!product.supplier) {
            setAlert({
                open: true,
                type: "error",
                message: "A supplier must be selected to add a product."
            });
            setLoading(prev => ({ ...prev, update: false }));
            return;
        }

        AuthApi.put("/products/update", product)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Product updated successfully."
                });
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: err.response.data.message
                });
                console.error("Error updating data:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, update: false }));
            });
    };

    useEffect(() => {
        fetchProduct();
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
                <Typography variant="h6" fontWeight="bold">Update Product</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Box component="form" action={updateProduct} sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "start" }}>
                    <TextField
                        margin="dense"
                        id="barcode"
                        name="barcode"
                        label="Barcode"
                        value={product.barcode}
                        sx={{ width: 400 }}
                        onChange={(e) => setProduct(prev => ({ ...prev, barcode: e.target.value }))}
                    />
                    <Autocomplete
                        options={suppliers}
                        getOptionLabel={(option) => option.name}
                        loading={loading.suppliers}
                        renderInput={(params) => <TextField {...params} name="supplier" label="Supplier" />}
                        onChange={(_, value) => setProduct(prev => ({ ...prev, supplier: value }))}
                        value={suppliers.find(supplier => supplier.id == product.supplier?.id) || null}
                        sx={{ width: 400, mt: 2 }}
                    />
                    <TextField
                        margin="dense"
                        id="productName"
                        name="productName"
                        label="Product Name"
                        value={product.name}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <TextField
                        margin="dense"
                        id="wholesalePrice"
                        name="wholesalePrice"
                        label="Wholesale Price"
                        type="number"
                        value={product.wholesalePrice}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setProduct(prev => ({ ...prev, wholesalePrice: parseFloat(e.target.value) }))}
                    />
                    <TextField
                        margin="dense"
                        id="retailPrice"
                        name="retailPrice"
                        label="Retail Price"
                        type="number"
                        value={product.retailPrice}
                        sx={{ width: 400, mt: 2 }}
                        onChange={(e) => setProduct(prev => ({ ...prev, retailPrice: parseFloat(e.target.value) }))}
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