import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { Alert, Box, Button, Container } from '@mui/material';
import { Add, DeleteOutlined, Download, Edit } from '@mui/icons-material';
import { AuthApi } from '../services/Api';
import AlertDialog from '../components/AlertDialog';
import DeleteAlert from '../components/DeleteAlert';
import { InsertAndUpdateDialog, InsertAndUpdateDialogTextField } from '../components/InsertAndUpdateDialog';

type SupplierDataType = {
    id?: number;
    name: string;
    phoneNumber: string;
    email: string;
};

export default function SuppliersScreen() {
    const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<{ open: boolean, id: GridRowId | null }>({
        open: false,
        id: null
    });
    const [generateReportDialog, setGenerateReportDialog] = useState<{ open: boolean, success: boolean }>({ open: false, success: false });
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
    const [formData, setFormData] = useState<{ data: SupplierDataType, isUpdate: boolean }>({
        data: {
            name: "",
            phoneNumber: "",
            email: ""
        },
        isUpdate: false
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
                        onClick={() => handleEditSupplier(row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => handleDeleteSupplier(id)}
                    />
                ];
            }
        }
    ];

    const handleFormDialogClose = () => {
        setFormData({
            data: {
                name: "",
                phoneNumber: "",
                email: ""
            },
            isUpdate: false
        });
        setIsFormDialogOpen(false);
    }

    const handleFormDialogOpen = () => {
        setIsFormDialogOpen(true);
    }

    const handleDeleteSupplier = (id: GridRowId) => {
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

    const handleEditSupplier = (row: SupplierDataType) => {
        setFormData({ data: row, isUpdate: true });
        handleFormDialogOpen();
    }

    const handleFormDataChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            data: {
                ...prev.data,
                [e.target.name]: e.target.value
            }
        }));
    };


    const handleAlertClose = () => {
        setAlert(prev => ({ ...prev, open: false }));
    };

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

    const addSupplier = () => {
        setLoading(prev => ({ ...prev, form: true }));
        AuthApi.post("/suppliers/add", formData.data)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Supplier registererd successfully."
                });
                fetchSuppliers();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Registering supplier failed."
                });
                console.error("Error adding data:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleFormDialogClose();
            });
    };

    const updateSupplier = () => {
        setLoading(prev => ({ ...prev, form: true }));
        AuthApi.put("/suppliers/update", formData.data)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Supplier updated successfully."
                });
                fetchSuppliers();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Supplier update failed."
                });
                console.error("Error updaing data:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleFormDialogClose();
            });
    };

    const deleteSupplier = () => {
        if (!isConfirmationDialogOpen.open) {
            return;
        }
        setLoading(prev => ({ ...prev, form: true }));
        AuthApi.delete("/suppliers/delete", {
            params: { id: isConfirmationDialogOpen.id }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Supplier deleted successfully."
                });
                fetchSuppliers();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Supplier deletion failed."
                });
                console.error("Error deleting Supplier:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleConfirmationDialogClose();
            });
    };

    const generateReport = () => {
        setLoading(prev => ({ ...prev, button: true }));
        AuthApi.get("/suppliers/generate_report")
            .then(() => setGenerateReportDialog({ open: true, success: true }))
            .catch(() => setGenerateReportDialog({ open: true, success: false }))
            .finally(() => {
                setLoading(prev => ({ ...prev, button: false }));
            });
    };

    useEffect(() => {
        fetchSuppliers();
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
                    Add Supplier
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

            {/* Add / update Supplier dialog */}
            <InsertAndUpdateDialog
                open={isFormDialogOpen}
                onClose={handleFormDialogClose}
                formData={formData}
                updateHandler={updateSupplier}
                insertHandler={addSupplier}
                insertContent="Add Supplier"
                updateContent="Update Supplier"
                loading={loading.form}
            >
                <InsertAndUpdateDialogTextField
                    name="name"
                    label="Name"
                    type="text"
                    value={formData?.data.name}
                    formDataChangeHandler={handleFormDataChange}
                    autoFocus={true}
                />
                <InsertAndUpdateDialogTextField
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    value={formData?.data.phoneNumber}
                    formDataChangeHandler={handleFormDataChange}
                />
                <InsertAndUpdateDialogTextField
                    name="email"
                    label="Email"
                    type="text"
                    value={formData?.data.email}
                    formDataChangeHandler={handleFormDataChange}
                />
            </InsertAndUpdateDialog>


            {/* Delete supplier confirmation dialog */}
            <DeleteAlert
                open={isConfirmationDialogOpen.open}
                onClose={handleConfirmationDialogClose}
                content="Are you sure you want to delete this supplier?"
                loading={loading.form}
                deleteHanlder={deleteSupplier}
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
