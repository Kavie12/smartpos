import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Add, DeleteOutlined, Download, Edit } from '@mui/icons-material';
import { AuthApi } from '../services/Api';
import AlertDialog from '../components/AlertDialog';
import DeleteAlert from '../components/DeleteAlert';
import { InsertAndUpdateDialog, InsertAndUpdateDialogTextField } from '../components/InsertAndUpdateDialog';

type EmployeeDataType = {
    id?: number;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email?: string;
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
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
    const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
    const [updateRow, setUpdateRow] = useState<EmployeeDataType | null>(null);

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
            flex: 1,
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
        setUpdateRow(null);
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
        setUpdateRow(row);
        handleFormDialogOpen();
    }

    const handleUpdateRowChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (updateRow) {
            setUpdateRow({ ...updateRow, [e.target.name]: e.target.value });
        }
    };

    const fetchEmployees = () => {
        setIsTableLoading(true);
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
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => setIsTableLoading(false));
    };

    const addEmployee = (data: { [k: string]: any }) => {
        setIsFormLoading(true);
        AuthApi.post("/employees/add", data)
            .then(() => fetchEmployees())
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => {
                setIsFormLoading(false);
                handleFormDialogClose();
            });
    };

    const updateEmployee = () => {
        setIsFormLoading(true);
        AuthApi.put("/employees/update", updateRow)
            .then(() => fetchEmployees())
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => {
                setIsFormLoading(false);
                handleFormDialogClose();
            });
    };

    const deleteEmployee = () => {
        if (!isConfirmationDialogOpen.open) {
            return;
        }
        setIsFormLoading(true);
        AuthApi.delete("/employees/delete", {
            params: { id: isConfirmationDialogOpen.id }
        })
            .then(() => fetchEmployees())
            .catch(err => console.error("Error deleting Employee:", err))
            .finally(() => {
                setIsFormLoading(false);
                handleConfirmationDialogClose();
            });
    };

    const generateReport = () => {
        setIsButtonLoading(true);
        AuthApi.get("/employees/generate_report")
            .then(() => setGenerateReportDialog({ open: true, success: true }))
            .catch(() => setGenerateReportDialog({ open: true, success: false }))
            .finally(() => {
                setIsButtonLoading(false);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, [paginationModel]);

    return (
        <Container maxWidth="xl">

            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Button onClick={handleFormDialogOpen} startIcon={<Add />}>
                    <Typography variant="button">Add Employee</Typography>
                </Button>

                <Button onClick={generateReport} startIcon={<Download />} loading={isButtonLoading}>
                    <Typography variant="button">Generate Report</Typography>
                </Button>
            </Box>

            {/* Table */}
            <Box sx={{ height: 500 }}>
                <DataGrid
                    columns={columns}
                    rows={pageData.rows}
                    rowHeight={40}
                    rowCount={pageData.rowCount}
                    loading={isTableLoading}
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
                updateRow={updateRow}
                updateHandler={updateEmployee}
                insertHandler={addEmployee}
                insertContent="Add Employee"
                updateContent="Update Employee"
                loading={isFormLoading}
            >
                <InsertAndUpdateDialogTextField
                    name="firstName"
                    label="First Name"
                    type="text"
                    value={updateRow?.firstName}
                    updateRowChangeHandler={handleUpdateRowChange}
                />
                <InsertAndUpdateDialogTextField
                    name="lastName"
                    label="Last Name"
                    type="text"
                    value={updateRow?.lastName}
                    updateRowChangeHandler={handleUpdateRowChange}
                />
                <InsertAndUpdateDialogTextField
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    value={updateRow?.phoneNumber}
                    updateRowChangeHandler={handleUpdateRowChange}
                />
                <InsertAndUpdateDialogTextField
                    name="email"
                    label="email"
                    type="text"
                    value={updateRow?.email}
                    updateRowChangeHandler={handleUpdateRowChange}
                />
            </InsertAndUpdateDialog>


            {/* Delete employee confirmation dialog */}
            <DeleteAlert
                open={isConfirmationDialogOpen.open}
                onClose={handleConfirmationDialogClose}
                content="Are you sure you want to delete this employee?"
                loading={isFormLoading}
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
