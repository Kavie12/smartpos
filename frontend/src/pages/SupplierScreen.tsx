import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Add, DeleteOutlined, Download, Edit } from '@mui/icons-material';
import { AuthApi } from '../services/Api';
import AlertDialog from '../components/AlertDialog';
import DeleteAlert from '../components/DeleteAlert';
import { InsertAndUpdateDialog, InsertAndUpdateDialogTextField } from '../components/InsertAndUpdateDialog';

type SupplierDataType = {
    id?: number;
    name?: string;
    phoneNumber?: string;
    email?: string;
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
    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
    const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
    const [updateRow, setUpdateRow] = useState<SupplierDataType | null>(null);

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
        setUpdateRow(null);
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
        setUpdateRow(row);
        handleFormDialogOpen();
    }

    const handleUpdateRowChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (updateRow) {
            setUpdateRow({ ...updateRow, [e.target.name]: e.target.value });
        }
    };

    const fetchSuppliers = () => {
        setIsTableLoading(true);
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
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => setIsTableLoading(false));
    };

    const addSupplier = (data: { [k: string]: any }) => {
        setIsFormLoading(true);
        AuthApi.post("/suppliers/add", data)
            .then(() => fetchSuppliers())
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => {
                setIsFormLoading(false);
                handleFormDialogClose();
            });
    };

    const updateSupplier = () => {
        setIsFormLoading(true);
        AuthApi.put("/suppliers/update", updateRow)
            .then(() => fetchSuppliers())
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => {
                setIsFormLoading(false);
                handleFormDialogClose();
            });
    };

    const deleteSupplier = () => {
        if (!isConfirmationDialogOpen.open) {
            return;
        }
        setIsFormLoading(true);
        AuthApi.delete("/suppliers/delete", {
            params: { id: isConfirmationDialogOpen.id }
        })
            .then(() => fetchSuppliers())
            .catch(err => console.error("Error deleting Supplier:", err))
            .finally(() => {
                setIsFormLoading(false);
                handleConfirmationDialogClose();
            });
    };

    const generateReport = () => {
        setIsButtonLoading(true);
        AuthApi.get("/suppliers/generate_report")
            .then(() => setGenerateReportDialog({ open: true, success: true }))
            .catch(() => setGenerateReportDialog({ open: true, success: false }))
            .finally(() => {
                setIsButtonLoading(false);
            });
    };

    useEffect(() => {
        fetchSuppliers();
    }, [paginationModel]);

    return (
        <Container maxWidth="xl">

            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Button onClick={handleFormDialogOpen} startIcon={<Add />}>
                    <Typography variant="button">Add Supplier</Typography>
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

            {/* Add / update Supplier dialog */}
            <InsertAndUpdateDialog
                open={isFormDialogOpen}
                onClose={handleFormDialogClose}
                updateRow={updateRow}
                updateHandler={updateSupplier}
                insertHandler={addSupplier}
                insertContent="Add Supplier"
                updateContent="Update Supplier"
                loading={isFormLoading}
            >
                <InsertAndUpdateDialogTextField
                    name="name"
                    label="Name"
                    type="text"
                    value={updateRow?.name}
                    updateRowChangeHandler={handleUpdateRowChange}
                />
                <InsertAndUpdateDialogTextField
                    name="phoneNumber"
                    label="Phone Number"
                    type="text"
                    value={updateRow?.email}
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


            {/* Delete supplier confirmation dialog */}
            <DeleteAlert
                open={isConfirmationDialogOpen.open}
                onClose={handleConfirmationDialogClose}
                content="Are you sure you want to delete this supplier?"
                loading={isFormLoading}
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
