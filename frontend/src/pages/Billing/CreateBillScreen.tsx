import { useEffect, useState } from "react";
import { AuthApi } from "../../services/Api";
import { Box, Button, Checkbox, Divider, FormControlLabel, Grid2, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import QuantityCounter from "../../components/QuantityCounter";
import { Link } from "react-router";
import { BillingRecordDataType, LoyaltyMemberDataType } from "../../types/types";
import { ArrowBack, Cancel, Delete } from "@mui/icons-material";
import { useBilling } from "../../context/BillingContext";
import BasicAlert from "../../components/BasicAlert";

export default function CreateBillScreen() {

    const { bill, setBill, redeemPoints, clearBill } = useBilling();

    const [barcode, setBarcode] = useState<string | null>(null);
    const [loyaltyMemberId, setLoyaltyMemberId] = useState<string>("");
    const [error, setError] = useState<{ barcode: string | null, loyaltyMember: string | null }>({
        barcode: null,
        loyaltyMember: null
    });
    const [quantity, setQuantity] = useState<number>(1);
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });

    const addProduct = (): void => {
        if (!barcode) {
            setError(prev => ({ ...prev, barcode: "Enter barcode." }));
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
                setBarcode("");
                setQuantity(1);
            })
            .catch(err => {
                setError(prev => ({ ...prev, barcode: err.response.data.message }));
            });
    };

    const saveBill = (): void => {

        if (bill.billingRecords.length === 0) {
            setAlert(prev => ({ ...prev, open: true, type: "error", message: "No item selected." }));
            return;
        }

        AuthApi.post("/billing/create", { bill, redeemPoints })
            .then(() => {
                clearBill();
                setAlert(prev => ({ ...prev, open: true, type: "success", message: "Bill saved successfully." }));
            })
            .catch(err => {
                setAlert(prev => ({ ...prev, open: true, type: "error", message: err.response.data.message || "Error saving bill." }));
                console.log(err);
            })
            .finally(() => {
                setQuantity(1);
            });
    };

    const setLoyaltyMember = (): void => {
        setError(prev => ({ ...prev, loyaltyMember: null }));

        if (!loyaltyMemberId) {
            setError(prev => ({ ...prev, loyaltyMember: "Enter loyalty member ID." }));
            return;
        }

        AuthApi.get("/loyalty_members/get_one_by_phone_number", {
            params: {
                phoneNumber: loyaltyMemberId
            }
        })
            .then(res => {
                setBill(prev => ({
                    ...prev,
                    loyaltyMember: res.data
                }));
                setLoyaltyMemberId("");
            })
            .catch(err => {
                setError(prev => ({ ...prev, loyaltyMember: err.response.data.message }));
            });
    };

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/billing">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h5" fontWeight="bold">Create Bill</Typography>
            </Box>

            <Box sx={{ px: 5 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

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
                                    <Button variant="contained" type="submit" id="addBarcodeBtn">Add</Button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Loyalty Member ID Input */}
                        <Box>
                            <Typography variant="body2" sx={{ marginBottom: 1 }}>Enter Loyalty Member ID</Typography>
                            <Box component="form" action={setLoyaltyMember} sx={{ display: "flex", alignItems: "center", columnGap: 4, justifyContent: "space-between" }}>
                                <TextField
                                    id="loyaltyMemberInput"
                                    size="small"
                                    sx={{ width: 400 }}
                                    value={loyaltyMemberId}
                                    onChange={e => setLoyaltyMemberId(e.target.value)}
                                    error={error.loyaltyMember !== null}
                                    helperText={error.loyaltyMember ? `*${error.loyaltyMember}` : null}
                                />
                                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                                    <Button variant="contained" type="submit" id="addLoyaltyMemberBtn">Add</Button>
                                </Box>
                            </Box>
                        </Box>

                        {/* Loyalty member details */}
                        <LoyaltyMemberDetails data={bill.loyaltyMember} />

                    </Grid2>
                    <Grid2 size={6}>
                        <Box sx={{ backgroundColor: grey[200], borderRadius: 2, paddingX: 4, paddingY: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Billed Items</Typography>
                            <BilledItems items={bill.billingRecords} />
                            <Box sx={{ marginTop: 6, display: "flex", flexDirection: "column" }}>
                                <Divider />

                                {/* Sub Total */}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                                    <Typography fontWeight={"bold"}>Sub Total:</Typography>
                                    <Typography fontWeight={"bold"}>Rs. {bill.total}</Typography>
                                </Box>

                                {
                                    /* Points Redeemed */
                                    bill.pointsRedeemed > 0 && (
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                                            <Typography fontWeight={"bold"}>Points Redeemed:</Typography>
                                            <Typography fontWeight={"bold"}>{bill.pointsRedeemed}</Typography>
                                        </Box>
                                    )
                                }

                                {/* Total */}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                                    <Typography fontWeight={"bold"}>Total:</Typography>
                                    <Typography fontWeight={"bold"}>Rs. {bill.total - bill.pointsRedeemed}</Typography>
                                </Box>

                                {
                                    /* Paid Amount */
                                    bill.billingRecords.length > 0 &&
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                                        <Typography fontWeight={"bold"}>Paid Amount:</Typography>
                                        <Box>
                                            <TextField
                                                id="paidAmount"
                                                variant="standard"
                                                size="small"
                                                type="number"
                                                slotProps={{
                                                    input: {
                                                        startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                                    },
                                                }}
                                                value={bill.paidAmount}
                                                onChange={e => setBill(prev => ({ ...prev, paidAmount: parseFloat(e.target.value) }))}
                                                sx={{
                                                    width: 140
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                }

                                {
                                    /* Balance */
                                    bill.billingRecords.length > 0 && bill.paidAmount != undefined && bill.paidAmount > 0 &&
                                    < Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                                        <Typography fontWeight={"bold"}>Balance:</Typography>
                                        <Typography fontWeight={"bold"}>Rs. {bill.paidAmount - bill.total}</Typography>
                                    </Box>
                                }

                                {/* Buttons */}
                                <Button variant="contained" sx={{ marginTop: 4 }} onClick={saveBill} id="printBillBtn">
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
            </Box >
        </>
    );
}

const BilledItems = ({ items }: { items: BillingRecordDataType[] }) => {
    return (
        <Box sx={{ marginTop: 4, display: "flex", flexDirection: "column", rowGap: 2 }}>
            {
                items.map((item, key) => {
                    return <BilledItem item={item} key={key} />;
                })
            }
        </Box>
    );
};

const BilledItem = ({ item, key }: { item: BillingRecordDataType, key: number }) => {

    const { setBill } = useBilling();
    const [quantity, setQuantity] = useState<number>(item.quantity);

    const removeItem = () => {
        setBill(prev => ({
            ...prev,
            billingRecords: prev.billingRecords.filter(record => record.product.id !== item.product.id)
        }));
    };

    useEffect(() => {
        setBill(prev => ({
            ...prev,
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

const LoyaltyMemberDetails = ({ data }: { data: LoyaltyMemberDataType | null }) => {

    const { bill, setBill, redeemPoints, setRedeemPoints } = useBilling();

    if (data === null) {
        return <></>;
    }

    const closeHandler = () => {
        setBill(prev => ({
            ...prev,
            loyaltyMember: null
        }));
        setRedeemPoints(false);
    };

    return (
        <Box sx={{ backgroundColor: grey[200], borderRadius: 2, paddingX: 4, paddingY: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6">Loyalty Member Details</Typography>
                <IconButton
                    onClick={closeHandler}
                >
                    <Cancel />
                </IconButton>
            </Box>
            <Box sx={{ mt: 2, display: "flex", flexDirection: "column", rowGap: 1 }}>
                <Typography>ID: {data.phoneNumber}</Typography>
                <Typography>Name: {data.firstName + " " + data.lastName}</Typography>
                <Typography>Current Points: {data.points}</Typography>
                {
                    /* Points Granted */
                    bill.pointsGranted > 0 &&
                    <Typography fontWeight={"bold"} sx={{ mt: 2 }}>Points Granted: {bill.pointsGranted}</Typography>
                }
            </Box>
            <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "end" }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            value={redeemPoints}
                            onChange={e => setRedeemPoints(e.target.checked)}
                            disabled={data.points == 0}
                        />
                    }
                    label={<Typography variant="body2">Redeem Points</Typography>}
                    labelPlacement="start"
                />
            </Box>
        </Box>
    );
};