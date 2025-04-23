import * as React from 'react';
import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Divider, Icon, Typography,} from '@mui/material';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import axios from 'axios';

export default function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(()=> {
        axios.get("http://localhost:5000/getProducts")
        .then(response => {
            setProducts(response.data);
            alert("Success mf!");
        })
        .catch(error => {
            alert("Unsuccessfull mf!!");
        });

    }, []);

    // const rows = [
    //     createData('Frozen yoghurt', 80),
    //     createData('Ice cream sandwich', 120),
    //     createData('Eclair', 140),
    //     createData('Cupcake', 100),
    //     createData('Gingerbread', 200),
    //   ];

    // function createData(name, price) {
    //     return { name, price };
    //   }

    return(
    <>
        <Typography variant="h4">Products List</Typography>
        <Divider style={{margin: "10px 0px 20px 0px"}}/>

    {/* Table (mui) */}
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <TableContainer component={Paper} sx={{width: "60%"}}>
            <Table sx={{ minWidth: 650 , width: "50%"}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell align='left'>Product</TableCell>
                        <TableCell align='right'>Price</TableCell>
                        <TableCell align='right'>Edit</TableCell>
                        <TableCell align='right'>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.pId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {product.pid}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {product.pName}
                            </TableCell>
                            <TableCell align="right">
                                Rs.{product.price}.00
                            </TableCell>
                            <TableCell align='right' fontSize='large'>
                                <IconButton aria-label="delete" size="small">
                                    <EditNoteTwoToneIcon fontSize="inherit" />
                                </IconButton>
                            </TableCell>
                            <TableCell align='right'>
                                <IconButton>
                                    <DeleteOutlineIcon/>
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </TableContainer>
        </div>
    </>
    );
}