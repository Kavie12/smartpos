import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Alert, Box, Button, Container } from '@mui/material';
import { Add, DeleteOutlined, Edit } from '@mui/icons-material';
import { AuthApi } from '../services/Api';
import { Link } from 'react-router';
import { BillingDataType, BillingRecordDataType } from '../types/types';

export default function BillingHistoryScreen() {
    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 10,
    });
    const [pageData, setPageData] = useState<{ rows: BillingDataType[], rowCount: number }>({
        rows: [],
        rowCount: 0
    });
    const [loading, setLoading] = useState<{ table: boolean }>({
        table: false
    });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });

    const columns: GridColDef[] = [
        {
            field: "createdAt",
            headerName: "Date",
            type: "dateTime",
            flex: 1,
            valueGetter: (value) => {
                return new Date(value);
            }
        },
        {
            field: "customer",
            headerName: "Customer",
            sortable: false,
            flex: 2,
            valueGetter: (_, row) => {
                return row.loyaltyCustomer === null ? "-" : row.loyaltyCustomer.firstName + " " + row.loyaltyCustomer.lastName;
            }
        },
        {
            field: "totalPrice",
            headerName: "Total Price",
            type: "number",
            align: "left",
            headerAlign: "left",
            sortable: false,
            flex: 1,
            valueGetter: (_, row) => {
                let price = 0;
                row.billingRecords.forEach((record: BillingRecordDataType) => {
                    price += record.price ? record.price * record.quantity : 0;
                });
                return "Rs. " + price;
            }
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "actions",
            flex: 1,
            getActions: ({ id, row }) => {
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                        onClick={() => console.log("Edit: " + row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => console.log("Delete: " + id)}
                    />
                ];
            }
        }
    ];

    const handleAlertClose = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const fetchBills = () => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/billing/get", {
            params: {
                page: paginationModel.page,
                size: paginationModel.pageSize
            }
        })
            .then(res => {
                setPageData({
                    rows: res.data.content,
                    rowCount: res.data.page.totalElements
                });
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed fetching bills."
                });
                console.error("Error fetching data:", err);
            })
            .finally(() => setLoading(prev => ({ ...prev, table: false })));
    };

    useEffect(() => {
        fetchBills();
    }, [paginationModel]);

    return (
        <Container maxWidth="xl">

            {/* Alerts */}
            {alert.open && (
                <Box sx={{ marginTop: 2 }}>
                    {alert.type == "success" && <Alert severity="success" onClose={handleAlertClose}>{alert.message}</Alert>}
                    {alert.type == "error" && <Alert severity="error">{alert.message}</Alert>}
                </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Link to="/create_bill">
                    <Button startIcon={<Add />}>
                        Create Bill
                    </Button>
                </Link>
            </Box>

            {/* Table */}
            <Box sx={{ height: 500 }}>
                <DataGrid
                    columns={columns}
                    rows={pageData.rows}
                    rowHeight={40}
                    rowCount={pageData.rowCount}
                    loading={loading.table}
                    pageSizeOptions={[10, 50, 100]}
                    paginationModel={paginationModel}
                    paginationMode="server"
                    onPaginationModelChange={setPaginationModel}
                />
            </Box>

        </Container>
    );
}
