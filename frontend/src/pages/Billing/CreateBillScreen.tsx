import { ChangeEvent, useEffect, useState } from "react";
import { AuthApi } from "../../services/Api";
import { Alert, Box, Button, Divider, Grid2, IconButton, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import QuantityCounter from "../../components/QuantityCounter";
import { Link } from "react-router";
import { BillingRecordDataType } from "../../types/types";
import { ArrowBack } from "@mui/icons-material";

export default function CreateBillScreen() {

    const [barcode, setBarcode] = useState<string | null>(null);
    const [error, setError] = useState<{ emptyBarcode: string | null, wrongBarcode: string | null, saveBill: string | null }>({
        emptyBarcode: null,
        wrongBarcode: null,
        saveBill: null,
    });
    const [items, setItems] = useState<BillingRecordDataType[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [total, setTotal] = useState<number>(0);

    const clearBill = () => {
        setItems([]);
    };

    const handleBarcodeInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBarcode(e.target.value);
    };

    const addProduct = () => {
        setError(prev => ({ ...prev, emptyBarcode: null }));
        if (!barcode) {
            setError(prev => ({ ...prev, emptyBarcode: "Enter barcode" }));
            return;
        }
        AuthApi.get("/products/find_by_barcode", {
            params: {
                barcode: barcode
            }
        })
            .then(res => {
                if (res.data !== "") {
                    setError(prev => ({ ...prev, wrongBarcode: null }));
                    setItems(prev =>
                        [
                            ...prev,
                            {
                                product: res.data,
                                quantity: quantity
                            }
                        ]
                    );
                }
            })
            .catch(err => {
                setError(prev => ({ ...prev, wrongBarcode: "Product not found" }));
                console.log(err);
            })
            .finally(() => {
                setBarcode("");
                setQuantity(1);
            });
    };

    const saveBill = () => {
        setError(prev => ({ ...prev, saveBill: null }));
        AuthApi.post("/billing/create", {
            billingRecords: items,
            loyaltyCustomer: null
        })
            .then(() => {
                clearBill();
                setAlert(prev => ({ ...prev, open: true, type: "success", message: "Bill Saved" }));
            })
            .catch(err => {
                setError(prev => ({ ...prev, saveBill: err }));
                setAlert(prev => ({ ...prev, open: true, type: "success", message: error.saveBill }));
                console.log(err);
            })
            .finally(() => {
                setQuantity(1);
            });
    };

    useEffect(() => {

        setTotal(
            items.reduce((total, item) => {
                return total + item.product.retailPrice * item.quantity;
            }, 0)
        );

    }, [items]);

    return (
        <>

            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/billing">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h6" fontWeight="bold">Create Bill</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                {alert.open && (
                    <Box sx={{ my: 2 }}>
                        {alert.type == "success" && <Alert severity="success" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                        {alert.type == "error" && <Alert severity="error" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                    </Box>
                )}
                <Grid2 container spacing={4} sx={{ mt: 4 }}>
                    <Grid2 size={6}>
                        <Box>
                            <Typography variant="body2" sx={{ marginBottom: 1 }}>Enter Barcode</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", columnGap: 4, justifyContent: "space-between" }}>
                                <TextField
                                    id="barcodeInput"
                                    size="small"
                                    autoFocus
                                    sx={{ width: 400 }}
                                    value={barcode}
                                    onChange={e => handleBarcodeInputChange(e)}
                                    error={error.emptyBarcode !== null}
                                />
                                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                                    <QuantityCounter quantity={quantity} setQuantity={setQuantity} />
                                    <Button variant="contained" onClick={() => addProduct()}>Add</Button>
                                </Box>
                            </Box>
                            {error.wrongBarcode && <Typography color="error" sx={{ mt: 1 }}>{error.wrongBarcode}</Typography>}
                        </Box>
                    </Grid2>
                    <Grid2 size={6}>
                        <Box sx={{ backgroundColor: grey[200], borderRadius: 2, paddingX: 4, paddingY: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Billed Items</Typography>
                            <BilledItems items={items} />
                            <Box sx={{ marginTop: 6, display: "flex", flexDirection: "column" }}>
                                <Divider />
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                                    <Typography fontWeight={"bold"}>Total:</Typography>
                                    <Typography fontWeight={"bold"}>Rs. {total}</Typography>
                                </Box>
                                <Button variant="contained" sx={{ marginTop: 4 }} onClick={() => saveBill()}>
                                    Print Bill
                                </Button>
                                <Button
                                    variant="text"
                                    color="error"
                                    sx={{ marginTop: 1 }}
                                    onClick={() => clearBill()}
                                >
                                    Cancel Bill
                                </Button>
                            </Box>
                        </Box>
                    </Grid2>
                </Grid2>
            </Box>
        </>
    );
}

const BilledItems = ({ items }: { items: BillingRecordDataType[] }) => {
    return (
        <>
            <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", rowGap: 2 }}>
                {
                    items.map((item, key) => {
                        return <BilledItem item={item} key={key} />;
                    })
                }
            </Box>
        </>
    );
};

const BilledItem = ({ item, key }: { item: BillingRecordDataType, key: number }) => {

    return (
        <Box key={key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                <Typography>{item.product.name}</Typography>
                <Typography>{item.quantity}x</Typography>
            </Box>
            <Typography>Rs. {item.product.retailPrice * item.quantity}</Typography>
        </Box>
    );
};