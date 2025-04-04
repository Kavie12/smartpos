import { useEffect, useState } from "react";
import { AuthApi } from "../../services/Api";
import { Alert, Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import QuantityCounter from "../../components/QuantityCounter";
import { Link, useParams } from "react-router";
import { BillingDataType, BillingRecordDataType } from "../../types/types";
import { ArrowBack } from "@mui/icons-material";

export default function UpdateBillScreen() {

    const { billId } = useParams();

    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [bill, setBill] = useState<BillingDataType>({
        billingRecords: []
    });
    const [total, setTotal] = useState<number>(0);

    const updateBill = (): void => {
        AuthApi.put("/billing/update", bill)
            .then(() => {
                setAlert(prev => ({ ...prev, open: true, type: "success", message: "Bill updated successfully." }));
                fetchBill();
            })
            .catch(err => {
                setAlert(prev => ({ ...prev, open: true, type: "success", message: "Error updating bill" }));
                console.log(err);
            });
    };

    const fetchBill = (): void => {
        AuthApi.get("/billing/get_one", {
            params: {
                billId: billId
            }
        })
            .then(res => {
                setBill(res.data);
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed fetching bill."
                });
                console.error("Error fetching data:", err);
            });
    };

    useEffect(() => {
        fetchBill();
    }, []);

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
                <Link to={`/billing/bill_details/${billId}`}>
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h6" fontWeight="bold">Update Bill</Typography>
            </Box>

            <Box sx={{ px: 5, mt: 2, width: 800 }}>
                {/* Alerts */}
                {alert.open && (
                    <Box sx={{ my: 2 }}>
                        {alert.type == "success" && <Alert severity="success" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                        {alert.type == "error" && <Alert severity="error" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                    </Box>
                )}
                <Box>
                    <Box sx={{ backgroundColor: grey[200], borderRadius: 2, paddingX: 4, paddingY: 3 }}>
                        <Typography variant="h6" fontWeight="bold">Billed Items</Typography>
                        <BilledItems items={bill.billingRecords} setBill={setBill} />
                        <Box sx={{ marginTop: 6, display: "flex", flexDirection: "column" }}>
                            <Divider />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                                <Typography fontWeight={"bold"}>Total:</Typography>
                                <Typography fontWeight={"bold"}>Rs. {total}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "end", columnGap: 2 }}>
                                <Button variant="contained" sx={{ marginTop: 4 }} onClick={updateBill}>
                                    Update Bill
                                </Button>
                                <Button variant="contained" sx={{ marginTop: 4 }} onClick={updateBill}>
                                    Update & Print Bill
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

const BilledItems = ({ items, setBill }: { items: BillingRecordDataType[], setBill: React.Dispatch<React.SetStateAction<BillingDataType>> }) => {
    return (
        <>
            <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", rowGap: 2 }}>
                {
                    items.map((item, key) => {
                        return <BilledItem item={item} key={key} setBill={setBill} />;
                    })
                }
            </Box>
        </>
    );
};

const BilledItem = ({ item, key, setBill }: { item: BillingRecordDataType, key: number, setBill: React.Dispatch<React.SetStateAction<BillingDataType>> }) => {

    const [quantity, setQuantity] = useState<number>(item.quantity);

    useEffect(() => {
        setBill(prev => ({
            billingRecords: prev.billingRecords.map(record =>
                record.product.id === item.product.id ? { ...record, quantity: quantity } : record
            )
        }));
    }, [quantity]);

    return (
        <Box key={key} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                <Typography>{item.product.name}</Typography>
                <QuantityCounter quantity={quantity} setQuantity={setQuantity} color="white" />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                <Typography>Rs. {item.product.retailPrice * item.quantity}</Typography>
            </Box>
        </Box>
    );
};