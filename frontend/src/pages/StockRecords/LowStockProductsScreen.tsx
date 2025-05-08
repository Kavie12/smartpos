import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBack, Email } from '@mui/icons-material';
import { AuthApi } from '../../services/Api';
import { ProductDataType } from '../../types/types';
import { Link } from 'react-router';
import BasicAlert from '../../components/BasicAlert';

export default function LowStockProductsScreen() {

    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 50,
    });
    const [pageData, setPageData] = useState<{ rows: ProductDataType[], rowCount: number }>({
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
            field: "barcode",
            headerName: "Barcode",
            sortable: false,
            flex: 1.5
        },
        {
            field: "name",
            headerName: "Product Name",
            sortable: false,
            flex: 2
        },
        {
            field: "supplierName",
            headerName: "Supplier Name",
            sortable: false,
            flex: 2,
            valueGetter: (_, row) => {
                return row.supplier.name;
            }
        },
        {
            field: "stockLevel",
            headerName: "Stock Level",
            type: "number",
            align: "left",
            headerAlign: "left",
            sortable: false,
            flex: 1
        },
        {
            field: "contactSupplier",
            headerName: "Contact Supplier",
            flex: 1,
            renderCell: (params) => {
                return (
                    <a href={`mailto:${params.row.supplier.email}`}>
                        <IconButton size="small">
                            <Email fontSize="small" />
                        </IconButton>
                    </a>
                );
            }
        }
    ];

    const fetchProducts = (): void => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/stock_records/get_low_stock_products", {
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
                    message: "Failed fetching products."
                });
                console.error("Error fetching data:", err);
            })
            .finally(() => setLoading(prev => ({ ...prev, table: false })));
    };

    useEffect(() => {
        fetchProducts();
    }, [paginationModel]);

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", alignItems: "center", columnGap: 1, my: 2 }}>
                <Link to="/stock_records">
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                </Link>
                <Typography variant="h5" fontWeight="bold">Low Stock Products</Typography>
            </Box>

            {/* Alerts */}
            <BasicAlert
                alert={alert}
                onClose={() => setAlert(prev => ({ ...prev, open: false }))}
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
