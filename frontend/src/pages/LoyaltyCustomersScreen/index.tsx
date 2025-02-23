import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Api from '../../services/Api';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { Add, DeleteOutlined, Edit } from '@mui/icons-material';

type customerDataType = {
    id?: number,
    name?: string,
    phoneNumber?: string,
    points?: number
}

export default function LoyaltyCustomersScreen() {
    const { token } = useAuth();
    const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState<{ open: boolean, id: GridRowId | null }>({
        open: false,
        id: null
    });
    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 10,
    });
    const [pageData, setPageData] = useState<{ rows: customerDataType[], rowCount: number }>({
        rows: [],
        rowCount: 0
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [updateRow, setUpdateRow] = useState<customerDataType | null>(null);

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
            field: "name",
            headerName: "Name",
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
        setUpdateRow(null);
        setIsFormDialogOpen(false);
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

    const handleEditCustomer = (row: customerDataType) => {
        setUpdateRow(row);
        handleFormDialogOpen();
    }

    const handleUpdateRowChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (updateRow) {
            setUpdateRow({ ...updateRow, [e.target.name]: e.target.value });
        }
    };

    const fetchCustomers = () => {
        setIsLoading(true);
        Api.get("/loyalty_customers/get", {
            headers: {
                Authorization: `Bearer ${token}`
            },
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
            .finally(() => setIsLoading(false));
    };

    const addCustomer = (data: { [k: string]: any }) => {
        setIsLoading(true);
        Api.post("/loyalty_customers/add", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => fetchCustomers())
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => {
                setIsLoading(false);
                handleFormDialogClose();
            });
    };

    const updateCustomer = () => {
        setIsLoading(true);
        Api.put("/loyalty_customers/update", updateRow, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(() => fetchCustomers())
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => {
                setIsLoading(false);
                handleFormDialogClose();
            });
    };

    const deleteCustomer = () => {
        if (!isConfirmationDialogOpen.open) {
            return;
        }
        setIsLoading(true);
        Api.delete("/loyalty_customers/delete", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { id: isConfirmationDialogOpen.id }
        })
            .then(() => fetchCustomers())
            .catch(err => console.error("Error deleting customer:", err))
            .finally(() => {
                setIsLoading(false);
                handleConfirmationDialogClose();
            });
    };

    useEffect(() => {
        fetchCustomers();
    }, [paginationModel]);

    return (
        <Container maxWidth="xl">

            {/* Add record button */}
            <Button sx={{ marginY: 2 }} onClick={handleFormDialogOpen}>
                <Add />
                <Typography variant="button">Add Record</Typography>
            </Button>

            {/* Table */}
            <Box sx={{ height: "75vh" }}>
                <DataGrid
                    columns={columns}
                    rows={pageData.rows}
                    rowHeight={40}
                    rowCount={pageData.rowCount}
                    loading={isLoading}
                    pageSizeOptions={[10, 50, 100]}
                    paginationModel={paginationModel}
                    paginationMode="server"
                    onPaginationModelChange={setPaginationModel}
                />
            </Box>

            {/* Dialog */}
            <Dialog
                open={isFormDialogOpen}
                onClose={handleFormDialogClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());

                            if (updateRow) {
                                updateCustomer();
                            } else {
                                addCustomer(formJson);
                            }
                        }
                    }
                }}
            >
                <DialogTitle>{updateRow ? "Update Loyalty Customer" : "Add Loyalty Customer"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={updateRow?.name}
                        onChange={handleUpdateRowChange}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        value={updateRow?.phoneNumber}
                        onChange={handleUpdateRowChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleFormDialogClose()}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogActions>
            </Dialog>


            {/* Delete customer confirmation dialog */}
            <Dialog
                open={isConfirmationDialogOpen.open}
                onClose={handleConfirmationDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Warning
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmationDialogClose}>Cancel</Button>
                    <Button onClick={deleteCustomer} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

        </Container >
    );
}
