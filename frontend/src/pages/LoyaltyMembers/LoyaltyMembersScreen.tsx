import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { Add, CreditCard, DeleteOutlined, Edit, Search } from '@mui/icons-material';
import { AuthApi } from '../../services/Api';
import { LoyaltyMemberDataType } from '../../types/types';
import { Link, useNavigate } from 'react-router';
import DeleteDialog from '../../components/DeleteDialog';
import BasicAlert from '../../components/BasicAlert';

export default function LoyaltyMembersScreen() {

    const navigate = useNavigate();

    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 50,
    });
    const [pageData, setPageData] = useState<{ rows: LoyaltyMemberDataType[], rowCount: number }>({
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
            sortable: false,
            flex: 0.5
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
                        onClick={() => navigate(`./update_loyalty_member/${id}`)}
                        id={`update_${id}`}
                    />,
                    <GridActionsCellItem
                        icon={<DeleteOutlined />}
                        label="Delete"
                        color="inherit"
                        onClick={() => setDeleteDialog({ id: id, open: true })}
                        id={`delete_${id}`}
                    />,
                    <GridActionsCellItem
                        icon={<CreditCard />}
                        label="Generate Loyalty Card"
                        color="inherit"
                        onClick={() => generateLoyaltyCard(id)}
                        id={`delete_${id}`}
                    />
                ];
            }
        }
    ];

    const fetchLoyaltyMembers = (): void => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/loyalty_members/get", {
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
                    message: "Fetching loyalty members failed."
                });
            })
            .finally(() => setLoading(prev => ({ ...prev, table: false })));
    };

    const deleteLoyaltyMember = (): void => {
        setLoading(prev => ({ ...prev, delete: true }));
        AuthApi.delete("/loyalty_members/delete", {
            params: {
                id: deleteDialog.id
            }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Loyalty member deleted successfully."
                });
                fetchLoyaltyMembers();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed to delete loyalty member."
                });
                console.error("Error deleting loyalty member:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, delete: false }));
                setDeleteDialog(prev => ({ ...prev, open: false }));
            });
    };

    const generateLoyaltyCard = (id: GridRowId): void => {
        AuthApi.get("/loyalty_members/generate_card", {
            params: {
                id: id
            }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Loyalty card generated successfully."
                });
            })
            .catch(err => {
                console.error("Error generating loyalty card.", err);
                setAlert({
                    open: true,
                    type: "error",
                    message: "Error generating loyalty card."
                });
            });
    };

    useEffect(() => {
        fetchLoyaltyMembers();
    }, [paginationModel, searchKey]);

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                    <Typography variant="h5" fontWeight="bold">Loyalty Members</Typography>
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
                <Link to="./add_loyalty_member">
                    <Button startIcon={<Add />} id="addLoyaltyMemberBtn">
                        Add Loyalty Member
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
                onDelete={() => deleteLoyaltyMember()}
                loading={loading.delete}
                message="Are you sure you want to delete this loyalty member?"
            />

        </>
    );
}