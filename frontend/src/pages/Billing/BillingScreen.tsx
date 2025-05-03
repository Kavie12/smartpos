import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add, OpenInNew } from '@mui/icons-material';
import { AuthApi } from '../../services/Api';
import { Link, useNavigate } from 'react-router';
import { BillingDataType } from '../../types/types';
import { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import BasicAlert from '../../components/BasicAlert';

export default function BillingScreen() {

    const navigate = useNavigate();

    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 50,
    });
    const [pageData, setPageData] = useState<{ rows: BillingDataType[], rowCount: number }>({
        rows: [],
        rowCount: 0
    });
    const [loading, setLoading] = useState<{ table: boolean, delete: boolean }>({
        table: false,
        delete: false
    });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [searchDate, setSearchDate] = useState<Dayjs | null>(null);

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            type: "number",
            headerAlign: "left",
            align: "left",
            sortable: false,
            flex: 0.5
        },
        {
            field: "createdAt",
            headerName: "Date",
            type: "dateTime",
            sortable: false,
            flex: 1,
            valueGetter: (value) => {
                return new Date(value);
            }
        },
        {
            field: "loyaltyMember",
            headerName: "Loyalty Member",
            sortable: false,
            flex: 2,
            valueGetter: (_, row) => {
                return row.loyaltyMember ? row.loyaltyMember.firstName + " " + row.loyaltyMember.lastName : "-";
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
                return "Rs. " + (row.total - row.pointsRedeemed);
            }
        },
        {
            field: "actions",
            headerName: "View",
            type: "actions",
            flex: 1,
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<OpenInNew />}
                        label="View"
                        color="inherit"
                        onClick={() => navigate(`./bill_details/${id}`)}
                        id={`view_bill_${id}`}
                    />
                ];
            }
        }
    ];

    const fetchBills = (): void => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/billing/get", {
            params: {
                searchDate: searchDate?.format("YYYY-MM-DD"),
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
    }, [paginationModel, searchDate]);

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                    <Typography variant="h5" fontWeight="bold">Billing</Typography>
                    <DatePicker
                        label="Filter by date"
                        slotProps={{
                            textField: { size: 'small' },
                            field: { clearable: true }
                        }}
                        sx={{
                            "& .MuiOutlinedInput-input": {
                                fontSize: 14
                            }
                        }}
                        value={searchDate}
                        onChange={value => setSearchDate(value)}
                    />
                </Box>
                <Link to="./create_bill">
                    <Button startIcon={<Add />} id="createBillBtn">
                        Create Bill
                    </Button>
                </Link>
            </Box >

            {/* Alerts */}
            < BasicAlert
                alert={alert}
                onClose={() => setAlert(prev => ({ ...prev, open: false }))
                }
            />

            {/* Table */}
            <Box sx={{ height: "70vh" }}>
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
                    disableColumnMenu={true}
                    disableColumnResize={true}
                />
            </Box>
        </>
    );
}
