import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { Add, DeleteOutlined, Edit, Search } from '@mui/icons-material';
import { AuthApi } from '../../services/Api';
import { StockRecordType } from '../../types/types';
import { Link, useNavigate } from 'react-router';
import DeleteDialog from '../../components/DeleteDialog';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import BasicAlert from '../../components/BasicAlert';

export default function StockRecordsScreen() {
    const navigate = useNavigate();

    const [paginationModel, setPaginationModel] = useState<{ page: number, pageSize: number }>({
        page: 0,
        pageSize: 50,
    });
    const [pageData, setPageData] = useState<{ rows: StockRecordType[], rowCount: number }>({
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
    const [searchDate, setSearchDate] = useState<Dayjs | null>(null);

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
            field: "createdAt",
            headerName: "Date",
            type: "dateTime",
            sortable: false,
            flex: 1,
            valueGetter: (value) => {
                return new Date(value);
            }
        },
        {
            field: "productName",
            headerName: "Product Name",
            sortable: false,
            flex: 2,
            valueGetter: (_, row) => {
                return row.product.name;
            }
        },
        {
            field: "stockAmount",
            headerName: "Stock Amount",
            type: "number",
            align: "left",
            headerAlign: "left",
            sortable: false,
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
                        color="inherit"
                        onClick={() => navigate(`./update_stock_record/${id}`)}
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

    const fetchStockRecords = (): void => {
        setLoading(prev => ({ ...prev, table: true }));
        AuthApi.get("/stock_records/get", {
            params: {
                searchKey: searchKey,
                searchDate: searchDate?.format("YYYY-MM-DD"),
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
                    message: "Failed fetching stock records."
                });
                console.error("Error fetching data:", err);
            })
            .finally(() => setLoading(prev => ({ ...prev, table: false })));
    };

    const deleteRecord = (): void => {
        setLoading(prev => ({ ...prev, delete: true }));
        AuthApi.delete("/stock_records/delete", {
            params: {
                id: deleteDialog.id
            }
        })
            .then(() => {
                setAlert({
                    open: true,
                    type: "success",
                    message: "Stock record deleted successfully."
                });
                fetchStockRecords();
            })
            .catch(err => {
                setAlert({
                    open: true,
                    type: "error",
                    message: "Failed to delete Stock Record."
                });
                console.error("Error deleting Stock Record:", err);
            })
            .finally(() => {
                setLoading(prev => ({ ...prev, delete: false }));
                setDeleteDialog(prev => ({ ...prev, open: false }));
            });
    };

    useEffect(() => {
        fetchStockRecords();
    }, [paginationModel, searchKey, searchDate]);

    return (
        <>
            {/* Title Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", marginY: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", columnGap: 4 }}>
                    <Typography variant="h5" fontWeight="bold">Stock Records</Typography>
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
                    <DatePicker
                        label="Filter by date"
                        slotProps={{
                            textField: { size: "small" },
                            field: { clearable: true },
                        }}
                        sx={{
                            "& .MuiOutlinedInput-input": {
                                fontSize: 14
                            }
                        }}
                        value={searchDate}
                        onChange={value => setSearchDate(value)}
                    />
                    <Link to="./low_stock_products">
                        <Button>Low Stock Products</Button>
                    </Link>
                </Box>
                <Link to="./add_stock_record">
                    <Button startIcon={<Add />} id="addStockRecordBtn">
                        Add Stock
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
                onDelete={() => deleteRecord()}
                loading={loading.delete}
                message="Are you sure you want to delete this stock record?"
            />

        </>
    );
}
