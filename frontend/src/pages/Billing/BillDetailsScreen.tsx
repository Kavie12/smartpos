import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { BasicAlertType, BillingDataType, BillingRecordDataType } from "../../types/types";
import { AuthApi } from "../../services/Api";
import { Box, Button, Card, CardActions, CardContent, CircularProgress, Divider, Grid2, IconButton, Paper, Typography } from "@mui/material";
import { ArrowBack, Delete, Edit, Print } from "@mui/icons-material";
import DeleteDialog from "../../components/DeleteDialog";
import BasicAlert from "../../components/BasicAlert";
import { grey } from "@mui/material/colors";

export default function BillDetailsScreen() {

    const navigate = useNavigate();
    const { billId } = useParams();

    const [bill, setBill] = useState<BillingDataType>({
        billingRecords: [],
        loyaltyMember: null,
        pointsGranted: 0,
        pointsRedeemed: 0,
        total: 0,
        paidAmount: undefined
    });
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

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, marginTop: 2 }}>
                <Link to="/billing">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h5" fontWeight="bold">Bill Details</Typography>
            </Box>

            <Box sx={{ mx: 5, mt: 4 }}>
                {/* Alerts */}
                <BasicAlert
                    alert={alert}
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                />

                <Card sx={{ p: 2, width: bill.loyaltyMember ? "100%" : "50%" }}>
                    <CardContent>
                        {loading.bill ? (
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <CircularProgress />
                            </Box>
                        ) :
                            (
                                <Grid2 container spacing={8}>
                                    <Grid2 size={bill.loyaltyMember ? 6 : 12}>
                                        <BillDetails bill={bill} />
                                    </Grid2>
                                    {/* Loyalty member details */
                                        bill.loyaltyMember &&
                                        <Grid2 size={6}>
                                            <LoyaltyMemberDetails bill={bill} />
                                        </Grid2>
                                    }
                                </Grid2>
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
                            id="printBtn"
                        >
                            Generate Receipt
                        </Button>
                        <Button
                            startIcon={<Edit />}
                            size="small"
                            onClick={() => navigate(`/billing/update_bill/${billId}`)}
                            disabled={buttonDisable}
                            id="updateBtn"
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
                            id="deleteBtn"
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

const BillDetails = ({ bill }: { bill: BillingDataType }) => {
    return (
        <>
            {/* Id and date */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Bill ID: {bill.id}</Typography>
                <Typography variant="body2">
                    {bill.createdAt ? new Date(bill.createdAt.toString()).toLocaleString() : "N/A"}
                </Typography>
            </Box>

            <Divider sx={{ mt: 2 }} />

            {/* Billing records */}
            <Box sx={{ display: "flex", flexDirection: "column", rowGap: 1, mt: 4 }}>
                {bill.billingRecords.map((billingRecord, i) => (
                    <BillingRecordInfo billingRecord={billingRecord} key={i} />
                ))}
            </Box>

            < Divider sx={{ mt: 6 }} />

            {/* Sub Total */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                <Typography fontWeight={"bold"}>Sub Total</Typography>
                <Typography fontWeight={"bold"}>Rs. {bill.total}</Typography>
            </Box>

            {
                /* Points Redeemed */
                bill.pointsRedeemed > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1 }}>
                        <Typography fontWeight={"bold"}>Points Redeemed</Typography>
                        <Typography fontWeight={"bold"}>{bill.pointsRedeemed}</Typography>
                    </Box>
                )
            }

            {/* Total */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1 }}>
                <Typography fontWeight={"bold"}>Total</Typography>
                <Typography fontWeight={"bold"}>Rs. {bill.total - bill.pointsRedeemed}</Typography>
            </Box>

            {
                bill.paidAmount !== undefined && (
                    <>
                        {/* Paid Amount */}
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                            <Typography fontWeight={"bold"}>Paid Amount</Typography>
                            <Typography fontWeight={"bold"}>Rs. {bill.paidAmount}</Typography>
                        </Box>

                        {
                            // Outstanding / Balance
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 1 }}>
                                <Typography fontWeight={"bold"}>{bill.paidAmount < bill.total ? "Outstanding" : "Balance"}</Typography>
                                <Typography fontWeight={"bold"}>Rs. {Math.abs(bill.total - bill.paidAmount)}</Typography>
                            </Box>
                        }
                    </>
                )
            }
        </>
    );
};

const LoyaltyMemberDetails = ({ bill }: { bill: BillingDataType }) => {
    return (
        bill.loyaltyMember &&
        (
            <Paper sx={{ backgroundColor: grey[200], paddingX: 4, paddingY: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h6">Loyalty Member Details</Typography>
                </Box>
                <Box sx={{ mt: 2, display: "flex", flexDirection: "column", rowGap: 1 }}>
                    <Typography>ID: {bill.loyaltyMember.phoneNumber}</Typography>
                    <Typography>Name: {bill.loyaltyMember.firstName + " " + bill.loyaltyMember.lastName}</Typography>
                    <Typography>Points Granted: {bill.pointsGranted}</Typography>
                    <Typography>Total Points: {bill.loyaltyMember.points}</Typography>
                </Box>
            </Paper>
        )
    );
};