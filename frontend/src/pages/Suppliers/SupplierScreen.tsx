import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { Add, DeleteOutlined, Edit } from '@mui/icons-material';
import { AuthApi } from '../../services/Api';
import { SupplierDataType } from '../../types/types';
import { Link } from 'react-router';

export default function SuppliersScreen() {
    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 10,
    });
    const [pageData, setPageData] = useState<{ rows: SupplierDataType[], rowCount: number }>({
        rows: [],
        rowCount: 0
    });
    const [loading, setLoading] = useState<{ form: boolean, table: boolean, button: boolean }>({
        form: false,
        table: false,
        button: false
    });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });

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
            field: "name",
            headerName: "Name",
            sortable: false,
            flex: 2
        },
        {
            field: "phoneNumber",
            headerName: "Phone Number",
            sortable: false,
            flex: 1
        },
        {
            field: "email",
            headerName: "Email",
            sortable: false,
            flex: 1
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "actions",
            flex: 0.5,
            getActions: ({ id, row }) => {
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                        onClick={() => console.log("Edit " + row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => console.log("Delete " + id)}
                    />
                ];
            }
        }
    ];

    const fetchSuppliers = () => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/suppliers/get", {
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
                    message: "Failed fetching suppliers."
                });
                console.error("Error fetching data:", err);
            })
            .finally(() => setLoading(prev => ({ ...prev, table: false })));
    };

    useEffect(() => {
        fetchSuppliers();
    }, [paginationModel]);

    return (
        <>

            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Typography variant="h6" fontWeight="bold">Suppliers</Typography>
                <Link to="/add_supplier">
                    <Button startIcon={<Add />}>
                        Add Supplier
                    </Button>
                </Link>
            </Box>

            {/* Alerts */}
            {alert.open && (
                <Box sx={{ marginTop: 2 }}>
                    {alert.type == "success" && <Alert severity="success" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                    {alert.type == "error" && <Alert severity="error">{alert.message}</Alert>}
                </Box>
            )}

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

        </>
    );
}
