import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { Alert, Autocomplete, Box, Button, Container, TextField } from '@mui/material';
import { Add, DeleteOutlined, Download, Edit } from '@mui/icons-material';
import { AuthApi } from '../services/Api';
import AlertDialog from '../components/AlertDialog';
import DeleteAlert from '../components/DeleteAlert';
import { InsertAndUpdateDialog, InsertAndUpdateDialogTextField } from '../components/InsertAndUpdateDialog';

type StockRecordType = {
    id?: number;
    productName: string;
    product?: ProductDataType;
    stockAmount: number;
    createdAt?: String;
};

type ProductDataType = {
    id?: number;
    barcode: string;
    name: string;
    supplier?: SupplierDataType;
    wholesalePrice: number;
    retailPrice: number;
    stockLevel: number;
};

type SupplierDataType = {
    id?: number;
    name: string;
    phoneNumber: string;
    email: string;
};

export default function StockScreen() {
    const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<{ open: boolean, id: GridRowId | null }>({
        open: false,
        id: null
    });
    const [isProductAutocompleteOpen, setIsProductAutocompleteOpen] = useState<boolean>(false);
    const [generateReportDialog, setGenerateReportDialog] = useState<{ open: boolean, success: boolean }>({ open: false, success: false });
    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 10,
    });
    const [pageData, setPageData] = useState<{ rows: StockRecordType[], rowCount: number }>({
        rows: [],
        rowCount: 0
    });
    const [products, setProducts] = useState<ProductDataType[]>([]);
    const [loading, setLoading] = useState<{ form: boolean, table: boolean, button: boolean, products: boolean }>({
        form: false,
        table: false,
        button: false,
        products: false
    });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [formData, setFormData] = useState<{ data: StockRecordType, isUpdate: boolean }>({
        data: {
            productName: "",
            stockAmount: 0
        },
        isUpdate: false
    });
    const [selectedProduct, setSelectedProduct] = useState<ProductDataType | null | undefined>(null);

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
            field: "productName",
            headerName: "Product Name",
            sortable: false,
            flex: 2,
            valueGetter: (_, row) => {
                return row.product.name;
            }
        },
        {
            field: "stockAmount",
            headerName: "Stock Amount",
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
            getActions: ({ id, row }) => {
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                        onClick={() => handleEditStockRecord(row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => handleDeleteStockRecord(id)}
                    />
                ];
            }
        }
    ];

    const handleFormDialogClose = () => {
        setFormData({
            data: {
                productName: "",
                stockAmount: 0
            },
            isUpdate: false
        });
        setSelectedProduct(null);
        setIsFormDialogOpen(false);
    }

    const handleFormDialogOpen = () => {
        setIsFormDialogOpen(true);
    }

    const handleDeleteStockRecord = (id: GridRowId) => {
        handleConfirmationDialogOpen(id);
    }

    const handleConfirmationDialogClose = () => {
        setIsConfirmationDialogOpen({
            open: false,
            id: null
        });
    }

    const handleConfirmationDialogOpen = (id: GridRowId) => {
        setIsConfirmationDialogOpen({
            open: true,
            id: id
        });
    }

    const handleEditStockRecord = (row: StockRecordType) => {
        setSelectedProduct(row.product);
        setFormData({ data: row, isUpdate: true });
        handleFormDialogOpen();
    }

    const handleAlertClose = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const handleProductsAutocompleteOpen = () => {
        setIsProductAutocompleteOpen(true);
        if (products.length === 0) {
            fetchProducts();
        }
    };

    const handleProductsAutocompleteClose = () => {
        setIsProductAutocompleteOpen(false);
    };

    const handleFormDataChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [e.target.name]: e.target.value
            }
        }));
    };


    const fetchStockRecords = () => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/stock/get", {
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
                    message: "Failed fetching stock records."
                });
                console.error("Error fetching data:", err);
            })
            .finally(() => setLoading(prev => ({ ...prev, table: false })));
    };

    const fetchProducts = () => {
        setLoading(prev => ({ ...prev, products: true }));
        AuthApi.get("/products/get_all")
            .then(res => {
                setProducts(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed fetching products."
                });
            })
            .finally(() => setLoading(prev => ({ ...prev, products: false })));
    };

    const addStockRecord = () => {
        setLoading(prev => ({ ...prev, form: true }));

        if (!selectedProduct) {
            setAlert({
                open: true,
                type: "error",
                message: "A product must be selected to add a stock record."
            });
            setLoading(prev => ({ ...prev, form: false }));
            handleFormDialogClose();
            return;
        }

        formData.data["product"] = selectedProduct;

        AuthApi.post("/stock/add", formData.data)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Stock Record added successfully."
                });
                fetchStockRecords();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Adding stock record failed."
                });
                console.error("Error adding data:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleFormDialogClose();
            });
    };

    const updateStockRecord = () => {
        setLoading(prev => ({ ...prev, form: true }));

        if (!selectedProduct) {
            setAlert({
                open: true,
                type: "error",
                message: "A product must be selected to add a stock record."
            });
            setLoading(prev => ({ ...prev, form: false }));
            handleFormDialogClose();
            return;
        }

        formData.data["product"] = selectedProduct;

        AuthApi.put("/stock/update", formData.data)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Stock record updated successfully."
                });
                fetchStockRecords();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Stock record update failed."
                });
                console.error("Error updating data:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleFormDialogClose();
            });
    };

    const deleteStockRecord = () => {
        if (!isConfirmationDialogOpen.open) {
            return;
        }
        setLoading(prev => ({ ...prev, form: true }));
        AuthApi.delete("/stock/delete", {
            params: { id: isConfirmationDialogOpen.id }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Stock record deleted successfully."
                });
                fetchStockRecords();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Stock record deletion failed."
                });
                console.error("Error deleting stock record:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleConfirmationDialogClose();
            });
    };

    const generateReport = () => {
        setLoading(prev => ({ ...prev, button: true }));
        AuthApi.get("/stock/generate_report")
            .then(() => setGenerateReportDialog({ open: true, success: true }))
            .catch(() => setGenerateReportDialog({ open: true, success: false }))
            .finally(() => {
                setLoading(prev => ({ ...prev, button: false }));
            });
    };

    useEffect(() => {
        fetchStockRecords();
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
                <Button onClick={handleFormDialogOpen} startIcon={<Add />}>
                    Add Stock
                </Button>

                <Button onClick={generateReport} startIcon={<Download />} loading={loading.button}>
                    Generate Report
                </Button>
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

            {/* Add / update Product dialog */}
            <InsertAndUpdateDialog
                open={isFormDialogOpen}
                onClose={handleFormDialogClose}
                formData={formData}
                insertHandler={addStockRecord}
                updateHandler={updateStockRecord}
                insertContent="Add Product"
                updateContent="Update Product"
                loading={loading.form}
            >
                <Autocomplete
                    open={isProductAutocompleteOpen}
                    onOpen={handleProductsAutocompleteOpen}
                    onClose={handleProductsAutocompleteClose}
                    options={products}
                    getOptionLabel={(option) => option.name}
                    loading={loading.products}
                    renderInput={(params) => <TextField {...params} name="product" label="Product" />}
                    onChange={(_, value) => setSelectedProduct(value)}
                    value={selectedProduct}
                    sx={{ marginY: 1 }}
                />
                <InsertAndUpdateDialogTextField
                    name="stockAmount"
                    label="Stock Amount"
                    type="number"
                    value={formData?.data.stockAmount}
                    formDataChangeHandler={handleFormDataChange}
                />
            </InsertAndUpdateDialog>


            {/* Delete product confirmation dialog */}
            <DeleteAlert
                open={isConfirmationDialogOpen.open}
                onClose={handleConfirmationDialogClose}
                content="Are you sure you want to delete this product?"
                loading={loading.form}
                deleteHanlder={deleteStockRecord}
            />

            {/* Generate report alert */}
            <AlertDialog
                open={generateReportDialog.open}
                onClose={() => setGenerateReportDialog(prevState => ({ ...prevState, open: false }))}
                success={generateReportDialog.success}
                successContent="Report Generated Successfully."
                errorContent="Error Generating Report."
            />

        </Container>
    );
}
