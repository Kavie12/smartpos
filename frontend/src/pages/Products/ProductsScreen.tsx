import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { Add, DeleteOutlined, Edit, Search } from '@mui/icons-material';
import { AuthApi } from '../../services/Api';
import { ProductDataType } from '../../types/types';
import { Link, useNavigate } from 'react-router';
import DeleteDialog from '../../components/DeleteDialog';
import BasicAlert from '../../components/BasicAlert';

export default function ProductsScreen() {

    const navigate = useNavigate();

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
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean, id: GridRowId | null }>({
        open: false,
        id: null
    });
    const [searchKey, setSearchKey] = useState<string>("");

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "ID",
            type: "number",
            headerAlign: "left",
            align: "left",
            sortable: false,
            flex: 1
        },
        {
            field: "barcode",
            headerName: "Barcode",
            sortable: false,
            flex: 2
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
            field: "wholesalePrice",
            headerName: "Wholesale Price",
            sortable: false,
            flex: 1
        },
        {
            field: "retailPrice",
            headerName: "Retail Price",
            sortable: false,
            flex: 1
        },
        {
            field: "profitPerUnit",
            headerName: "Profit Per Unit",
            sortable: false,
            flex: 1,
            valueGetter: (_, row) => {
                return row.retailPrice - row.wholesalePrice;
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
            field: "actions",
            headerName: "Actions",
            type: "actions",
            flex: 1,
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        color="inherit"
                        onClick={() => navigate(`./update_product/${id}`)}
                        id={`update_${id}`}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => setDeleteDialog({ id: id, open: true })}
                        id={`delete_${id}`}
                    />
                ];
            }
        }
    ];

    const fetchProducts = (): void => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/products/get", {
            params: {
                searchKey: searchKey,
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

    const deleteProduct = (): void => {
        setLoading(prev => ({ ...prev, delete: true }));
        AuthApi.delete("/products/delete", {
            params: {
                productId: deleteDialog.id
            }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Product deleted successfully."
                });
                fetchProducts();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed to delete product."
                });
                console.error("Error deleting product:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, delete: false }));
                setDeleteDialog(prev => ({ ...prev, open: false }));
            });
    };

    useEffect(() => {
        fetchProducts();
    }, [paginationModel, searchKey]);

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                    <Typography variant="h5" fontWeight="bold">Products</Typography>
                    <TextField
                        size="small"
                        placeholder="Search"
                        id="searchField"
                        value={searchKey}
                        onChange={e => setSearchKey(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment:
                                    <InputAdornment position="start">
                                        <Search fontSize="small" />
                                    </InputAdornment>,
                                style: { fontSize: 14 }
                            }
                        }}
                    />
                </Box>
                <Link to="./add_product">
                    <Button startIcon={<Add />} id="addProductBtn">
                        Add Product
                    </Button>
                </Link>
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

            {/* Delete Alert */}
            <DeleteDialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
                onDelete={() => deleteProduct()}
                loading={loading.delete}
                message="Are you sure you want to delete this product?"
            />

        </>
    );
}
