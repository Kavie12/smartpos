import { ChangeEvent, useEffect, useState } from "react";
import { AuthApi } from "../services/Api";
import { Box, Button, Container, Grid2, TextField, Typography } from "@mui/material";
import { BillingItemType } from "../types/types";
import { grey } from "@mui/material/colors";

export default function CreateBillScreen() {
    const [barcode, setBarcode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<BillingItemType[]>([]);
    const [quantity, setQuantity] = useState<number>(1);

    const handleBarcodeInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBarcode(e.target.value);
    };


    // Changes to be tested
    const handleQuantityIncrement = () => {
        setQuantity(prev => prev + 1);
    };

    const handleQuantityDecrement = () => {
        setQuantity(prev => {
            return prev > 1 ? prev - 1 : prev;
        });
    };
    //

    const handleQuantityChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setQuantity(value);
        }
    };

    const addProduct = (barcode: string | null) => {
        if (!barcode) {
            setError("Enter barcode");
            return;
        }
        setError(null);
        AuthApi.get("/products/find_by_barcode", {
            params: {
                barcode: barcode
            }
        })
            .then(res => {
                setProducts(prev =>
                    [
                        ...prev,
                        {
                            item: res.data,
                            quantity: quantity
                        }
                    ]
                );
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setBarcode("");
                setQuantity(1);
            });
    };

    useEffect(() => {
        console.log(products);
    }, [products]);

    return (
        <Container maxWidth="xl">
            <Grid2 container sx={{ mt: 6 }}>
                <Grid2 size={6}>
                    <Box sx={{ display: "flex", alignItems: "start", columnGap: 4 }}>
                        <Box>
                            <TextField
                                id="barcodeInput"
                                label="Enter Barcode"
                                variant="outlined"
                                size="small"
                                value={barcode}
                                onChange={e => handleBarcodeInputChange(e)}
                            />
                            {error && <Typography variant="body1" color="error" sx={{ mt: 1 }} textAlign="center">{error}</Typography>}
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, backgroundColor: grey[300], borderRadius: 1 }}>
                            <Button variant="text" sx={{ minWidth: "auto" }} onClick={() => handleQuantityDecrement()}>-</Button>
                            <TextField
                                id="quantity"
                                variant="standard"
                                size="small"
                                slotProps={{
                                    input: {
                                        disableUnderline: true,
                                        style: {
                                            width: 26
                                        }
                                    }
                                }}
                                sx={{
                                    "& input": {
                                        textAlign: "center"
                                    }
                                }}
                                value={quantity}
                                onChange={handleQuantityChange}
                            />
                            <Button variant="text" sx={{ minWidth: "auto" }} onClick={() => handleQuantityIncrement()}>+</Button>
                        </Box>
                        <Button variant="contained" onClick={() => addProduct(barcode)}>Add</Button>
                    </Box>
                </Grid2>
                <Grid2 size={6}>

                </Grid2>
            </Grid2>
        </Container>
    );
}