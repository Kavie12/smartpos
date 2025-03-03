import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { Alert, Autocomplete, Box, Button, Container, TextField } from '@mui/material';
import { Add, DeleteOutlined, Download, Edit } from '@mui/icons-material';
import { AuthApi } from '../services/Api';
import AlertDialog from '../components/AlertDialog';
import DeleteAlert from '../components/DeleteAlert';
import { InsertAndUpdateDialog, InsertAndUpdateDialogTextField } from '../components/InsertAndUpdateDialog';

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

export default function ProductsScreen() {
    const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<{ open: boolean, id: GridRowId | null }>({
        open: false,
        id: null
    });
    const [isSupplierAutocompleteOpen, setIsSupplierAutocompleteOpen] = useState<boolean>(false);
    const [generateReportDialog, setGenerateReportDialog] = useState<{ open: boolean, success: boolean }>({ open: false, success: false });
    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 10,
    });
    const [pageData, setPageData] = useState<{ rows: ProductDataType[], rowCount: number }>({
        rows: [],
        rowCount: 0
    });
    const [suppliers, setSuppliers] = useState<SupplierDataType[]>([]);
    const [loading, setLoading] = useState<{ form: boolean, table: boolean, button: boolean, suppliers: boolean }>({
        form: false,
        table: false,
        button: false,
        suppliers: false
    });
    const [alert, setAlert] = useState<{ open: boolean, type: "error" | "success" | null, message: string | null }>({
        open: false,
        type: null,
        message: null
    });
    const [formData, setFormData] = useState<{ data: ProductDataType, isUpdate: boolean }>({
        data: {
            barcode: "",
            name: "",
            wholesalePrice: 0,
            retailPrice: 0,
            stockLevel: 0
        },
        isUpdate: false
    });
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierDataType | null | undefined>(null);

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
            getActions: ({ id, row }) => {
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                        onClick={() => handleEditProduct(row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => handleDeleteProduct(id)}
                    />
                ];
            }
        }
    ];

    const handleFormDialogClose = () => {
        setFormData({
            data: {
                barcode: "",
                name: "",
                wholesalePrice: 0,
                retailPrice: 0,
                stockLevel: 0
            },
            isUpdate: false
        });
        setSelectedSupplier(null);
        setIsFormDialogOpen(false);
    }

    const handleFormDialogOpen = () => {
        setIsFormDialogOpen(true);
    }

    const handleDeleteProduct = (id: GridRowId) => {
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

    const handleEditProduct = (row: ProductDataType) => {
        setSelectedSupplier(row.supplier);
        setFormData({ data: row, isUpdate: true });
        handleFormDialogOpen();
    }

    const handleAlertClose = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

    const handleSuppliersAutocompleteOpen = () => {
        setIsSupplierAutocompleteOpen(true);
        if (suppliers.length === 0) {
            fetchSuppliers();
        }
    };

    const handleSuppliersAutocompleteClose = () => {
        setIsSupplierAutocompleteOpen(false);
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


    const fetchProducts = () => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/products/get", {
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

    const fetchSuppliers = () => {
        setLoading(prev => ({ ...prev, suppliers: true }));
        AuthApi.get("/suppliers/get_all")
            .then(res => {
                setSuppliers(res.data);
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed fetching suppliers."
                });
            })
            .finally(() => setLoading(prev => ({ ...prev, suppliers: false })));
    };

    const addProduct = () => {
        setLoading(prev => ({ ...prev, form: true }));

        if (!selectedSupplier) {
            setAlert({
                open: true,
                type: "error",
                message: "A supplier must be selected to add a product."
            });
            setLoading(prev => ({ ...prev, form: false }));
            handleFormDialogClose();
            return;
        }

        formData.data["supplier"] = selectedSupplier;

        AuthApi.post("/products/add", formData.data)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Product added successfully."
                });
                fetchProducts();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Adding product failed."
                });
                console.error("Error adding data:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleFormDialogClose();
            });
    };

    const updateProduct = () => {
        setLoading(prev => ({ ...prev, form: true }));

        if (!selectedSupplier) {
            setAlert({
                open: true,
                type: "error",
                message: "A supplier must be selected to add a product."
            });
            setLoading(prev => ({ ...prev, form: false }));
            handleFormDialogClose();
            return;
        }

        formData.data["supplier"] = selectedSupplier;

        AuthApi.put("/products/update", formData.data)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Product updated successfully."
                });
                fetchProducts();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Product update failed."
                });
                console.error("Error fetching data:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleFormDialogClose();
            });
    };

    const deleteProduct = () => {
        if (!isConfirmationDialogOpen.open) {
            return;
        }
        setLoading(prev => ({ ...prev, form: true }));
        AuthApi.delete("/products/delete", {
            params: { id: isConfirmationDialogOpen.id }
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
                    message: "Product deletion failed."
                });
                console.error("Error deleting Product:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleConfirmationDialogClose();
            });
    };

    const generateReport = () => {
        setLoading(prev => ({ ...prev, button: true }));
        AuthApi.get("/products/generate_report")
            .then(() => setGenerateReportDialog({ open: true, success: true }))
            .catch(() => setGenerateReportDialog({ open: true, success: false }))
            .finally(() => {
                setLoading(prev => ({ ...prev, button: false }));
            });
    };

    useEffect(() => {
        fetchProducts();
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
                    Add Product
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
                insertHandler={addProduct}
                updateHandler={updateProduct}
                insertContent="Add Product"
                updateContent="Update Product"
                loading={loading.form}
            >
                <InsertAndUpdateDialogTextField
                    name="barcode"
                    label="Barcode"
                    type="text"
                    value={formData?.data.barcode}
                    formDataChangeHandler={handleFormDataChange}
                    autoFocus={true}
                />
                <Autocomplete
                    open={isSupplierAutocompleteOpen}
                    onOpen={handleSuppliersAutocompleteOpen}
                    onClose={handleSuppliersAutocompleteClose}
                    options={suppliers}
                    getOptionLabel={(option) => option.name}
                    loading={loading.suppliers}
                    renderInput={(params) => <TextField {...params} name="supplier" label="Supplier" />}
                    onChange={(_, value) => setSelectedSupplier(value)}
                    value={selectedSupplier}
                    sx={{ marginY: 1 }}
                />
                <InsertAndUpdateDialogTextField
                    name="name"
                    label="Product Name"
                    type="text"
                    value={formData?.data.name}
                    formDataChangeHandler={handleFormDataChange}
                />
                <InsertAndUpdateDialogTextField
                    name="wholesalePrice"
                    label="Wholesale Price"
                    type="number"
                    value={formData?.data.wholesalePrice}
                    formDataChangeHandler={handleFormDataChange}
                />
                <InsertAndUpdateDialogTextField
                    name="retailPrice"
                    label="Retail Price"
                    type="number"
                    value={formData?.data.retailPrice}
                    formDataChangeHandler={handleFormDataChange}
                />
            </InsertAndUpdateDialog>


            {/* Delete product confirmation dialog */}
            <DeleteAlert
                open={isConfirmationDialogOpen.open}
                onClose={handleConfirmationDialogClose}
                content="Are you sure you want to delete this product?"
                loading={loading.form}
                deleteHanlder={deleteProduct}
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
