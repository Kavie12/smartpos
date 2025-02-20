import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import Api from '../services/Api';
import { useAuth } from '../context/AuthContext';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone Number', flex: 1 },
    { field: 'points', headerName: 'Points', flex: 1 }
];

export default function LoyaltyCustomersScreen() {
    const { token } = useAuth();

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });

    const [pageData, setPageData] = useState({
        rows: [],
        rowCount: 0
    });
    const [isLoading, setIsLoading] = useState(false);

    const fetchRows = () => {
        setIsLoading(true);
        Api.get("/loyalty_customers/get", {
            headers: {
                "Authorization": `Bearer ${token}`
            },
            params: {
                page: paginationModel.page,
                size: paginationModel.pageSize
            }
        })
            .then(res => {
                setPageData({
                    rows: res.data.content,
                    rowCount: res.data.totalElements
                });
            })
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchRows();
    }, [paginationModel]);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                columns={columns}
                rows={pageData.rows}
                rowCount={pageData.rowCount}
                loading={isLoading}
                pageSizeOptions={[10, 50, 100]}
                paginationModel={paginationModel}
                paginationMode="server"
                onPaginationModelChange={setPaginationModel}
            />
        </div>
    );
}
