import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Api from '../../services/Api';
import { useAuth } from '../../context/AuthContext';
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Add, DeleteOutlined, Edit } from '@mui/icons-material';

export default function LoyaltyCustomersScreen() {
    const { token } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [pageData, setPageData] = useState({
        rows: [],
        rowCount: 0
    });
    const [isLoading, setIsLoading] = useState(false);

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
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                        onClick={() => editCustomer(id)}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => deleteCustomer(id)}
                    />
                ];
            }
        }
    ];

    const handleDialogClose = () => {
        setDialogOpen(false);
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    }

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

    const deleteCustomer = (id: GridRowId) => {
        setIsLoading(true);
        Api.delete("/loyalty_customers/delete", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { id }
        })
            .then(() => fetchCustomers())
            .catch(err => console.error("Error deleting customer:", err))
            .finally(() => setIsLoading(false));
    };

    const editCustomer = (id: GridRowId) => {
        console.log("Edit " + id);
    }

    useEffect(() => {
        fetchCustomers();
    }, [paginationModel]);

    return (
        <Container maxWidth="xl">

            {/* Add record button */}
            <Button sx={{ marginY: 2 }} onClick={handleDialogOpen}>
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
                open={dialogOpen}
                onClose={handleDialogClose}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());

                            console.log(formJson);

                            handleDialogClose();
                        },
                    },
                }}
            >
                <DialogTitle>Add Loyalty Customer</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Add Customer</Button>
                </DialogActions>
            </Dialog>

        </Container >
    );
}
