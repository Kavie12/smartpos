import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { BillingDataType, BillingRecordDataType } from "../../types/types";
import { AuthApi } from "../../services/Api";
import { Box, Card, CardContent, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export default function BillDetailsScreen() {

    const { state } = useLocation();
    const { id } = state;

    const [bill, setBill] = useState<BillingDataType>(null);
    const [total, setTotal] = useState<number | undefined>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBill = () => {
        setLoading(true);
        AuthApi.get("/billing/get_one", {
            params: {
                billId: id
            }
        })
            .then(res => {
                setBill(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {

        fetchBill();

    }, []);

    useEffect(() => {

        setTotal(
            bill?.billingRecords.reduce((total, item) => {
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
                <Typography variant="h6" fontWeight="bold">Bill Details</Typography>
            </Box>

            <Card sx={{ mx: 5, mt: 4, p: 2, width: 600 }}>
                <CardContent>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) :
                        (
                            <>
                                <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1 }}>
                                    {bill?.billingRecords.map((billingRecord, i) => (
                                        <BillingRecordInfo billingRecord={billingRecord} key={i} />
                                    ))}
                                </Box>

                                < Divider sx={{ mt: 6 }} />

                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                                    <Typography fontWeight={"bold"}>Sub Total:</Typography>
                                    <Typography fontWeight={"bold"}>Rs. {total}</Typography>
                                </Box>
                            </>
                        )
                    }
                </CardContent>
            </Card>
        </>
    );
}

function BillingRecordInfo({ billingRecord }: { billingRecord: BillingRecordDataType }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                <Typography>{billingRecord.product.name}</Typography>
                <Typography>{billingRecord.quantity}x</Typography>
            </Box>
            <Typography>Rs. {billingRecord.product.retailPrice * billingRecord.quantity}</Typography>
        </Box>
    );
}