import { ChangeEvent, useEffect, useState } from "react";
import { AuthApi } from "../services/Api";
import { Alert, Box, Button, Container, Grid2, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import QuantityCounter from "../components/QuantityCounter";
import { Link } from "react-router";
import { BillingRecordDataType } from "../types/types";

export default function CreateBillScreen() {
    const [barcode, setBarcode] = useState<string | null>(null);
    const [error, setError] = useState<{ barcode: string | null, barcodeProduct: string | null, saveBill: string | null }>({
        barcode: null,
        barcodeProduct: null,
        saveBill: null,
    });
    const [items, setItems] = useState<BillingRecordDataType[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });

    const clearBill = () => {
        setItems([]);
    }

    const handleAlertClose = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const handleBarcodeInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBarcode(e.target.value);
    };

    const addProduct = (barcode: string | null) => {
        setError(prev => ({ ...prev, barcode: null }));
        if (!barcode) {
            setError(prev => ({ ...prev, barcode: "Enter barcode" }));
            return;
        }
        AuthApi.get("/products/find_by_barcode", {
            params: {
                barcode: barcode
            }
        })
            .then(res => {
                if (res.data) {
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
                setError(prev => ({ ...prev, barcodeProduct: null }));
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

    return (
        <Container maxWidth="xl">

            {/* Alerts */}
            {alert.open && (
                <Box sx={{ marginTop: 2 }}>
                    {alert.type == "success" && <Alert severity="success" onClose={handleAlertClose}>{alert.message}</Alert>}
                    {alert.type == "error" && <Alert severity="error">{alert.message}</Alert>}
                </Box>
            )}

            <Box textAlign="end">
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => clearBill()}>
                    Reset Bill
                </Button>
            </Box>
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
                                error={error.barcode !== null}
                            />
                            <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                                <QuantityCounter quantity={quantity} setQuantity={setQuantity} />
                                <Button variant="contained" onClick={() => addProduct(barcode)}>Add</Button>
                            </Box>
                        </Box>
                    </Box>
                </Grid2>
                <Grid2 size={6}>
                    <BilledItemsSection items={items} saveBill={saveBill} />
                </Grid2>
            </Grid2>
        </Container>
    );
}

const BilledItemsSection = ({ items, saveBill }: { items: BillingRecordDataType[], saveBill: () => void }) => {
    return (
        <Box sx={{ backgroundColor: grey[200], borderRadius: 2, paddingX: 4, paddingY: 3 }}>
            <Typography variant="h6" fontWeight="bold">Billed Items</Typography>
            <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", rowGap: 2 }}>
                {
                    items.map((item, key) => {
                        return <BilledItem item={item} key={key} />;
                    })
                }
            </Box>
            <BillSummary items={items} saveBill={saveBill} />
        </Box >
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

const BillSummary = ({ items, saveBill }: { items: BillingRecordDataType[], saveBill: () => void }) => {

    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        setTotal(0);
        items.forEach((item) => {
            setTotal(prev => prev + item.product.retailPrice * item.quantity);
        });
    }, [items]);

    return (
        <Box sx={{ marginTop: 6, display: "flex", flexDirection: "column" }}>
            <Box sx={{ height: 1.5, backgroundColor: grey[400] }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                <Typography fontWeight={"bold"}>Sub Total:</Typography>
                <Typography fontWeight={"bold"}>Rs. {total}</Typography>
            </Box>
            <Button variant="contained" sx={{ marginTop: 4 }} onClick={() => saveBill()}>Print Bill</Button>
            <Link to="/billing" style={{ display: "flex", flexDirection: "column", textDecoration: "none" }}>
                <Button variant="text" color="error" sx={{ marginTop: 1 }}>Cancel Bill</Button>
            </Link>
        </Box>
    );
}