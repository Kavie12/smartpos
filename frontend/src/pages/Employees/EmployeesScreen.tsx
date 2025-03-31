import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';
import { Add, DeleteOutlined, Edit } from '@mui/icons-material';
import { AuthApi } from '../../services/Api';
import { EmployeeDataType } from '../../types/types';
import { Link } from 'react-router';
import DeleteDialog from '../../components/DeleteDialog';

export default function EmployeesScreen() {

    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 10,
    });
    const [pageData, setPageData] = useState<{ rows: EmployeeDataType[], rowCount: number }>({
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
                        color="inherit"
                        onClick={() => console.log("Edit " + row)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => setDeleteDialog({ id: id, open: true })}
                    />
                ];
            }
        }
    ];

    const fetchEmployees = (): void => {
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

    const deleteEmployee = (): void => {
        setLoading(prev => ({ ...prev, delete: true }));
        AuthApi.delete("/employees/delete", {
            params: {
                employeeId: deleteDialog.id
            }
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
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed to delete employee."
                });
                console.error("Error deleting employee:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, delete: false }));
                setDeleteDialog(prev => ({ ...prev, open: false }));
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, [paginationModel]);

    return (
        <>

            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Typography variant="h6" fontWeight="bold">Employee</Typography>
                <Link to="./add_employee">
                    <Button startIcon={<Add />}>
                        Add Employee
                    </Button>
                </Link>
            </Box>

            {/* Alerts */}
            {alert.open && (
                <Box sx={{ my: 2 }}>
                    {alert.type == "success" && <Alert severity="success" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
                    {alert.type == "error" && <Alert severity="error" onClose={() => setAlert(prev => ({ ...prev, open: false }))}>{alert.message}</Alert>}
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

            {/* Delete Alert */}
            <DeleteDialog
                open={deleteDialog.open}
                onClose={() => setDeleteDialog(prev => ({ ...prev, open: false }))}
                onDelete={() => deleteEmployee()}
                loading={loading.delete}
                message="Are you sure you want to delete this employee?"
            />

        </>
    );
}
