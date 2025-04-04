import { useEffect, useState } from "react";
import { AuthApi } from "../../services/Api";
import { Alert, Box, Button, Divider, Grid2, IconButton, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import QuantityCounter from "../../components/QuantityCounter";
import { Link } from "react-router";
import { BillingRecordDataType } from "../../types/types";
import { ArrowBack, Delete } from "@mui/icons-material";
import { useBilling } from "../../context/BillingContext";

export default function CreateBillScreen() {

    const { bill, setBill, clearBill } = useBilling();

    const [barcode, setBarcode] = useState<string | null>(null);
    const [error, setError] = useState<{ barcode: string | null, saveBill: string | null }>({
        barcode: null,
        saveBill: null
    });
    const [quantity, setQuantity] = useState<number>(1);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [total, setTotal] = useState<number>(0);

    const resetForm = (): void => {
        setBarcode("");
        setQuantity(1);
    };

    const addProduct = (): void => {
        if (!barcode) {
            setError(prev => ({ ...prev, barcode: "Enter barcode" }));
            return;
        }
        setError(prev => ({ ...prev, barcode: null }));
        AuthApi.get("/products/find_by_barcode", {
            params: {
                barcode: barcode
            }
        })
            .then(res => {
                console.log(res.data);
                if (res.data !== "") {
                    setBill(prev => {

                        const existingItemIndex = prev.billingRecords.findIndex(
                            record => record.product.id === res.data.id
                        );

                        if (existingItemIndex >= 0) {
                            const updatedRecords = [...prev.billingRecords];
                            updatedRecords[existingItemIndex] = {
                                ...updatedRecords[existingItemIndex],
                                quantity: updatedRecords[existingItemIndex].quantity + quantity
                            };

                            return {
                                ...prev,
                                billingRecords: updatedRecords
                            };
                        } else {
                            return {
                                ...prev,
                                billingRecords: [
                                    ...prev.billingRecords,
                                    {
                                        product: res.data,
                                        quantity: quantity
                                    }
                                ]
                            };
                        }
                    });
                }
                resetForm();
            })
            .catch(err => {
                setError(prev => ({ ...prev, barcode: err.response.data.message }));
            });
    };

    const saveBill = (): void => {
        setError(prev => ({ ...prev, saveBill: null }));
        AuthApi.post("/billing/create", bill)
            .then(() => {
                clearBill();
                setAlert(prev => ({ ...prev, open: true, type: "success", message: "Bill saved successfully." }));
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
            bill.billingRecords.reduce((total, item) => {
                return total + item.product.retailPrice * item.quantity;
            }, 0)
        );
    }, [bill]);

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
                    <Grid2 size={6} sx={{ display: "flex", flexDirection: "column", rowGap: 6 }}>

                        {/* Barcode Input */}
                        <Box>
                            <Typography variant="body2" sx={{ marginBottom: 1 }}>Enter Barcode</Typography>
                            <Box component="form" action={addProduct} sx={{ display: "flex", alignItems: "center", columnGap: 4, justifyContent: "space-between" }}>
                                <TextField
                                    id="barcodeInput"
                                    size="small"
                                    autoFocus
                                    sx={{ width: 400 }}
                                    value={barcode}
                                    onChange={e => setBarcode(e.target.value)}
                                    error={error.barcode !== null}
                                    helperText={error.barcode ? `*${error.barcode}` : null}
                                />
                                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                                    <QuantityCounter quantity={quantity} setQuantity={setQuantity} color="grey" />
                                    <Button variant="contained" type="submit">Add</Button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Loyalty Member ID Input */}
                        <Box>
                            <Typography variant="body2" sx={{ marginBottom: 1 }}>Enter Loyalty Member ID</Typography>
                            <Box component="form" action={addProduct} sx={{ display: "flex", alignItems: "center", columnGap: 4, justifyContent: "space-between" }}>
                                <TextField
                                    id="loyaltyCustomerInput"
                                    size="small"
                                    sx={{ width: 400 }}
                                />
                                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                                    <Button variant="contained" type="submit">Add</Button>
                                </Box>
                            </Box>
                        </Box>

                    </Grid2>
                    <Grid2 size={6}>
                        <Box sx={{ backgroundColor: grey[200], borderRadius: 2, paddingX: 4, paddingY: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Billed Items</Typography>
                            <BilledItems items={bill.billingRecords} />
                            <Box sx={{ marginTop: 6, display: "flex", flexDirection: "column" }}>
                                <Divider />
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                                    <Typography fontWeight={"bold"}>Total:</Typography>
                                    <Typography fontWeight={"bold"}>Rs. {total}</Typography>
                                </Box>
                                <Button variant="contained" sx={{ marginTop: 4 }} onClick={saveBill}>
                                    Print Bill
                                </Button>
                                <Button
                                    variant="text"
                                    color="error"
                                    sx={{ marginTop: 1 }}
                                    onClick={clearBill}
                                >
                                    Clear Bill
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

    const { setBill } = useBilling();
    const [quantity, setQuantity] = useState<number>(item.quantity);

    const removeItem = () => {
        setBill(prev => ({
            billingRecords: prev.billingRecords.filter(record => record.product.id !== item.product.id)
        }));
    };

    useEffect(() => {
        setBill(prev => ({
            billingRecords: prev.billingRecords.map(record =>
                record.product.id === item.product.id ? { ...record, quantity: quantity } : record
            )
        }));
    }, [quantity]);

    useEffect(() => {
        setQuantity(item.quantity);
    }, [item.quantity]);

    return (
        <Box key={key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                <Typography>{item.product.name}</Typography>
                <QuantityCounter quantity={quantity} setQuantity={setQuantity} color="white" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                <Typography>Rs. {item.product.retailPrice * item.quantity}</Typography>
                <IconButton size="small" onClick={removeItem}><Delete /></IconButton>
            </Box>
        </Box>
    );
};