import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { BasicAlertType, BillingDataType, BillingRecordDataType } from "../../types/types";
import { AuthApi } from "../../services/Api";
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import { ArrowBack, Delete, Edit, Print } from "@mui/icons-material";
import DeleteDialog from "../../components/DeleteDialog";
import BasicAlert from "../../components/BasicAlert";

export default function BillDetailsScreen() {

    const navigate = useNavigate();
    const { billId } = useParams();

    const [bill, setBill] = useState<BillingDataType | null>(null);
    const [total, setTotal] = useState<number | undefined>(0);
    const [loading, setLoading] = useState<{ bill: boolean, print: boolean, delete: boolean }>({
        bill: false,
        print: false,
        delete: false
    });
    const [alert, setAlert] = useState<BasicAlertType>({
        open: false,
        type: null,
        message: null
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [buttonDisable, setButtonDisable] = useState<boolean>(false);

    const fetchBill = (): void => {
        setLoading(prev => ({ ...prev, bill: true }));
        AuthApi.get("/billing/get_one", {
            params: {
                billId: billId
            }
        })
            .then(res => {
                console.log(res.data);
                setBill(res.data);
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: err.response.data.message
                });
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, bill: false }))
            });
    };

    const printBill = (): void => {
        setLoading(prev => ({ ...prev, print: true }));
        AuthApi.get("/billing/print", {
            params: {
                billId: billId
            }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Bill generated successfully."
                });
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: err.response.data.message
                });
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, print: false }))
            });
    };

    const deleteBill = (): void => {
        setLoading(prev => ({ ...prev, delete: true }));
        AuthApi.delete("/billing/delete", {
            params: {
                billId: bill?.id
            }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Bill deleted successfully."
                });
                setButtonDisable(true);
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed to delete bill."
                });
                console.error("Error deleting bill:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, delete: false }));
                setIsDeleteDialogOpen(false);
            });
    };

    useEffect(() => {
        fetchBill();
    }, [billId]);

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

            <Box sx={{ mx: 5, mt: 4 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Card sx={{ p: 2, width: 600 }}>
                    <CardContent>
                        {loading.bill ? (
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
                                        <Typography fontWeight={"bold"}>Total:</Typography>
                                        <Typography fontWeight={"bold"}>Rs. {total}</Typography>
                                    </Box>
                                </>
                            )
                        }
                    </CardContent>
                    <CardActions sx={{ marginTop: 4, justifyContent: "end" }}>
                        <Button
                            startIcon={<Print />}
                            size="small"
                            onClick={printBill}
                            loading={loading.print}
                            disabled={buttonDisable}
                        >
                            Print
                        </Button>
                        <Button
                            startIcon={<Edit />}
                            size="small"
                            onClick={() => navigate(`/billing/update_bill/${billId}`)}
                            disabled={buttonDisable}
                        >
                            Update
                        </Button>
                        <Button
                            startIcon={<Delete />}
                            size="small"
                            color="error"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            loading={loading.delete}
                            disabled={buttonDisable}
                        >
                            Delete
                        </Button>
                    </CardActions>
                </Card>
            </Box>

            {/* Delete Alert */}
            <DeleteDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onDelete={() => deleteBill()}
                loading={loading.delete}
                message="Are you sure you want to delete this bill?"
            />
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