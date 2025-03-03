import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { Alert, Box, Button, Container } from '@mui/material';
import { Add, DeleteOutlined, Download, Edit } from '@mui/icons-material';
import { AuthApi } from '../services/Api';
import AlertDialog from '../components/AlertDialog';
import DeleteAlert from '../components/DeleteAlert';
import { InsertAndUpdateDialog, InsertAndUpdateDialogTextField } from '../components/InsertAndUpdateDialog';

type EmployeeDataType = {
    id?: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
};

export default function EmployeesScreen() {
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
    const [pageData, setPageData] = useState<{ rows: EmployeeDataType[], rowCount: number }>({
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
    const [formData, setFormData] = useState<{ data: EmployeeDataType, isUpdate: boolean }>({
        data: {
            firstName: "",
            lastName: "",
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
                        onClick={() => handleEditEmployee(row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => handleDeleteEmployee(id)}
                    />
                ];
            }
        }
    ];

    const handleFormDialogClose = () => {
        setFormData({
            data: {
                firstName: "",
                lastName: "",
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

    const handleDeleteEmployee = (id: GridRowId) => {
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

    const handleEditEmployee = (row: EmployeeDataType) => {
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

    const fetchEmployees = () => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/employees/get", {
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
                    message: "Fetching employees failed."
                });
            })
            .finally(() => setLoading(prev => ({ ...prev, table: false })));
    };

    const addEmployee = () => {
        setLoading(prev => ({ ...prev, form: true }));
        AuthApi.post("/employees/add", formData.data)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Employee registered successfully."
                });
                fetchEmployees();
            })
            .catch(err => {
                console.error("Error adding data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed registering employee."
                });
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleFormDialogClose();
            });
    };

    const updateEmployee = () => {
        setLoading(prev => ({ ...prev, form: true }));
        AuthApi.put("/employees/update", formData.data)
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Employee updated successfully."
                });
                fetchEmployees();
            })
            .catch(err => {
                console.error("Error updating data:", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Employee update failed."
                });
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleFormDialogClose();
            });
    };

    const deleteEmployee = () => {
        if (!isConfirmationDialogOpen.open) {
            return;
        }
        setLoading(prev => ({ ...prev, form: true }));
        AuthApi.delete("/employees/delete", {
            params: { id: isConfirmationDialogOpen.id }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Employee deleted successfully."
                });
                fetchEmployees();
            })
            .catch(err => {
                console.error("Error deleting Employee:", err)
                setAlert({
                    open: true,
                    type: "error",
                    message: "Employee deletion failed."
                });
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, form: false }));
                handleConfirmationDialogClose();
            });
    };

    const generateReport = () => {
        setLoading(prev => ({ ...prev, button: true }));
        AuthApi.get("/employees/generate_report")
            .then(() => setGenerateReportDialog({ open: true, success: true }))
            .catch(() => setGenerateReportDialog({ open: true, success: false }))
            .finally(() => setLoading(prev => ({ ...prev, button: false })))
    };

    useEffect(() => {
        fetchEmployees();
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
                    Add Employee
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

            {/* Add / update Employee dialog */}
            <InsertAndUpdateDialog
                open={isFormDialogOpen}
                onClose={handleFormDialogClose}
                formData={formData}
                updateHandler={updateEmployee}
                insertHandler={addEmployee}
                insertContent="Add Employee"
                updateContent="Update Employee"
                loading={loading.form}
            >
                <InsertAndUpdateDialogTextField
                    name="firstName"
                    label="First Name"
                    type="text"
                    value={formData?.data.firstName}
                    formDataChangeHandler={handleFormDataChange}
                    autoFocus={true}
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
                <InsertAndUpdateDialogTextField
                    name="email"
                    label="email"
                    type="text"
                    value={formData?.data.email}
                    formDataChangeHandler={handleFormDataChange}
                />
            </InsertAndUpdateDialog>


            {/* Delete employee confirmation dialog */}
            <DeleteAlert
                open={isConfirmationDialogOpen.open}
                onClose={handleConfirmationDialogClose}
                content="Are you sure you want to delete this employee?"
                loading={loading.form}
                deleteHanlder={deleteEmployee}
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
