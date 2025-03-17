import { ChangeEvent, useState } from "react";
import { AuthApi } from "../services/Api";
import { Box, Button, Container, Grid2, TextField, Typography } from "@mui/material";
import { BillingItemType } from "../types/types";
import { grey } from "@mui/material/colors";
import QuantityCounter from "../components/QuantityCounter";

export default function CreateBillScreen() {
    const [barcode, setBarcode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<BillingItemType[]>([]);
    const [quantity, setQuantity] = useState<number>(1);

    const clearBill = () => {
        setItems([]);
    }

    const handleBarcodeInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBarcode(e.target.value);
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
                setItems(prev =>
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

    return (
        <Container maxWidth="xl">
            <Box textAlign="end">
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => clearBill()}>
                    Create New Bill
                </Button>
            </Box>
            <Grid2 container sx={{ mt: 4 }}>
                <Grid2 size={6}>
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                            <Box>
                                <TextField
                                    id="barcodeInput"
                                    label="Enter Barcode"
                                    variant="filled"
                                    size="small"
                                    autoFocus
                                    sx={{ width: 400 }}
                                    value={barcode}
                                    onChange={e => handleBarcodeInputChange(e)}
                                />
                            </Box>
                            <QuantityCounter quantity={quantity} setQuantity={setQuantity} color="grey" />
                            <Button variant="contained" onClick={() => addProduct(barcode)}>Add</Button>
                        </Box>
                        {error && <Typography variant="body1" color="error" sx={{ mt: 1 }} textAlign="center">{error}</Typography>}
                    </Box>
                </Grid2>
                <Grid2 size={6}>
                    <BilledItemsSection items={items} />
                </Grid2>
            </Grid2>
        </Container>
    );
}

const BilledItemsSection = ({ items }: { items: BillingItemType[] }) => {
    return (
        <Box sx={{ backgroundColor: grey[300], borderRadius: 2, paddingX: 4, paddingY: 3 }}>
            <Typography variant="h6" fontWeight="bold">Billed Items</Typography>
            <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", rowGap: 2 }}>
                {
                    items.map((item, key) => {
                        return <BilledItem item={item} key={key} />;
                    })
                }
            </Box>
        </Box >
    );
};

const BilledItem = ({ item, key }: { item: BillingItemType, key: number }) => {

    const [quantity, setQuantity] = useState<number>(item.quantity);

    return (
        <Box key={key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box key={key} sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                <Typography>{item.item.name}</Typography>
                <QuantityCounter quantity={quantity} setQuantity={setQuantity} color="white" />
            </Box>
            <Typography>Rs. {item.item.retailPrice * item.quantity}</Typography>
        </Box>
    );
};