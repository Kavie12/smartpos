import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { Add, DeleteOutlined, Edit, PersonAddAlt1, PersonRemove, Search } from '@mui/icons-material';
import { AuthApi } from '../../services/Api';
import { EmployeeDataType } from '../../types/types';
import { Link, useNavigate } from 'react-router';
import DeleteDialog from '../../components/DeleteDialog';
import BasicAlert from '../../components/BasicAlert';

export default function EmployeesScreen() {

    const navigate = useNavigate();

    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 50,
    });
    const [pageData, setPageData] = useState<{ rows: EmployeeDataType[], rowCount: number }>({
        rows: [],
        rowCount: 0
    });
    const [loading, setLoading] = useState<{ table: boolean, delete: boolean, removeSystemUser: boolean }>({
        table: false,
        delete: false,
        removeSystemUser: false
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
    const [removeSystemUserDialog, setRemoveSystemUserDialog] = useState<{ open: boolean, id: GridRowId | null }>({
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
            flex: 0.5
        },
        {
            field: "firstName",
            headerName: "First Name",
            sortable: false,
            flex: 0.75
        },
        {
            field: "lastName",
            headerName: "Last Name",
            sortable: false,
            flex: 0.75
        },
        {
            field: "phoneNumber",
            headerName: "Phone Number",
            sortable: false,
            flex: 0.75
        },
        {
            field: "email",
            headerName: "Email",
            sortable: false,
            flex: 1.25
        },
        {
            field: "salary",
            headerName: "Salary",
            sortable: false,
            flex: 0.75,
            valueGetter: (value) => {
                return "Rs. " + value;
            }
        },
        {
            field: "user",
            headerName: "System User",
            sortable: false,
            flex: 0.5,
            renderCell: (params) => {
                if (params.value === null) {
                    return (
                        <Link to={`./create_credentials/${params.row.id}`}>
                            <IconButton size="small">
                                <PersonAddAlt1 fontSize="small" />
                            </IconButton>
                        </Link>
                    );
                } else {
                    return (
                        <IconButton size="small" onClick={() => setRemoveSystemUserDialog({ id: params.row.id, open: true })}>
                            <PersonRemove fontSize="small" />
                        </IconButton>
                    );
                }
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "actions",
            flex: 0.5,
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        color="inherit"
                        onClick={() => navigate(`./update_employee/${id}`)}
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

    const fetchEmployees = (): void => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/employees/get", {
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

    const removeSystemUser = (): void => {
        setLoading(prev => ({ ...prev, removeSystemUser: true }));
        AuthApi.put("/employees/delete_credentials", null, {
            params: {
                employeeId: removeSystemUserDialog.id
            }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Employee removed from system users."
                });
                fetchEmployees();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed to remove employee from system users."
                });
                console.error("Error removing employee from system users:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, removeSystemUser: false }));
                setRemoveSystemUserDialog(prev => ({ ...prev, open: false }));
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, [paginationModel, searchKey]);

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginY: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                    <Typography variant="h5" fontWeight="bold">Employee</Typography>
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
                <Link to="./add_employee">
                    <Button startIcon={<Add />} id="addEmployeeBtn">
                        Add Employee
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
                onDelete={() => deleteEmployee()}
                loading={loading.delete}
                message="Are you sure you want to delete this employee?"
            />

            {/* Delete Credentials Alert */}
            <DeleteDialog
                open={removeSystemUserDialog.open}
                onClose={() => setRemoveSystemUserDialog(prev => ({ ...prev, open: false }))}
                onDelete={() => removeSystemUser()}
                loading={loading.removeSystemUser}
                message="Are you sure you want to remove this employee from system users?"
            />
        </>
    );
}
