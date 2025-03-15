import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { Alert, Box, Button, Container } from '@mui/material';
import { Add, DeleteOutlined, Download, Edit } from '@mui/icons-material';
import { AuthApi } from '../services/Api';
import AlertDialog from '../components/AlertDialog';
import DeleteAlert from '../components/DeleteAlert';
import { InsertAndUpdateDialog, InsertAndUpdateDialogTextField } from '../components/InsertAndUpdateDialog';
import { CustomerDataType } from '../types/types';

export default function LoyaltyMembersScreen() {
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
    const [pageData, setPageData] = useState<{ rows: CustomerDataType[], rowCount: number }>({
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
    const [formData, setFormData] = useState<{ data: CustomerDataType, isUpdate: boolean }>({
        data: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            points: 0
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
            field: "firstName",
            headerName: "First Name",
            sortable: false,
            flex: 1
        },
        {
            field: "lastName",
            headerName: "Last Name",
            sortable: false,
            flex: 1
        },
        {
            field: "phoneNumber",
            headerName: "Phone Number",
            sortable: false,
            flex: 1
        },
        {
            field: "points",
            headerName: "Points",
            type: "number",
            headerAlign: "left",
            align: "left",
            flex: 0.5
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
                        onClick={() => handleEditCustomer(row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => handleDeleteCustomer(id)}
                    />
                ];
            }
        }
    ];

    const handleFormDialogClose = () => {
        setIsFormDialogOpen(false);
        setFormData(prev => ({
            ...prev,
            data: {
                firstName: "",
                lastName: "",
                phoneNumber: "",
                points: 0
            },
            isUpdate: false
        }));
    }

    const handleFormDialogOpen = () => {
        setIsFormDialogOpen(true);
    }

    const handleDeleteCustomer = (id: GridRowId) => {
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

    const handleEditCustomer = (row: CustomerDataType) => {
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

    const fetchCustomers = () => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/loyalty_customers/get", {
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
                console.error("Error fetching data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Fetching customers failed."
                });
            })
            .finally(() => setLoading(prev => ({ ...prev, table: false })));
    };

    const addCustomer = () => {
        setLoading(prev => ({ ...prev, form: true }));
        console.log(formData);
        AuthApi.post("/loyalty_customers/add", formData.data)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Customer registererd successfully."
                });
                fetchCustomers();
            })
            .catch(err => {
                console.error("Error adding data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Registering customer failed."
                });
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleFormDialogClose();
            });
    };

    const updateCustomer = () => {
        setLoading(prev => ({ ...prev, form: true }));
        AuthApi.put("/loyalty_customers/update", formData.data)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Customer updated successfully."
                });
                fetchCustomers();
            })
            .catch(err => {
                console.error("Error updating data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Customer updated failed."
                });
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleFormDialogClose();
            });
    };

    const deleteCustomer = () => {
        if (!isConfirmationDialogOpen.open) {
            return;
        }
        setLoading(prev => ({ ...prev, form: true }));
        AuthApi.delete("/loyalty_customers/delete", {
            params: { id: isConfirmationDialogOpen.id }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Customer deleted successfully."
                });
                fetchCustomers();
            })
            .catch(err => {
                console.error("Error deleting customer:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Customer deletion failed."
                });
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleConfirmationDialogClose();
            });
    };

    const generateReport = () => {
        setLoading(prev => ({ ...prev, button: true }));
        AuthApi.get("/loyalty_customers/generate_report")
            .then(() => setGenerateReportDialog({ open: true, success: true }))
            .catch(() => setGenerateReportDialog({ open: true, success: false }))
            .finally(() => {
                setLoading(prev => ({ ...prev, button: false }));
            });
    };

    useEffect(() => {
        fetchCustomers();
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
                    Add Loyalty Member
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

            {/* Add / update customer dialog */}
            <InsertAndUpdateDialog
                open={isFormDialogOpen}
                onClose={handleFormDialogClose}
                formData={formData}
                updateHandler={updateCustomer}
                insertHandler={addCustomer}
                insertContent="Add Loyalty Customer"
                updateContent="Update Loyalty Customer"
                loading={loading.form}
            >
                <InsertAndUpdateDialogTextField
                    name="firstName"
                    label="First Name"
                    type="text"
                    value={formData?.data.firstName}
                    formDataChangeHandler={handleFormDataChange}
                />
                <InsertAndUpdateDialogTextField
                    name="lastName"
                    label="Last Name"
                    type="text"
                    value={formData?.data.lastName}
                    formDataChangeHandler={handleFormDataChange}
                />
                <InsertAndUpdateDialogTextField
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    value={formData?.data.phoneNumber}
                    formDataChangeHandler={handleFormDataChange}
                />
            </InsertAndUpdateDialog>



            {/* Delete customer confirmation dialog */}
            <DeleteAlert
                open={isConfirmationDialogOpen.open}
                onClose={handleConfirmationDialogClose}
                content="Are you sure you want to delete this customer?"
                loading={loading.form}
                deleteHanlder={deleteCustomer}
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
