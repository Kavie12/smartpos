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

    function handleDelete(id) {

        axios.delete("http://localhost:5000/deleteProduct", {data: {id: id}})
        .then(response => {
            alert("Deletion is completed!!");
            setProducts(products.filter(product => product.pid !== id));
        })
        .catch(error => {
            alert("Caught to an error while deleting the product!!");
        });
    }

    function handleEdit() {
        alert("It is aobut to be Edit!");
    }

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
                        <TableRow key={product.pid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                                <IconButton onClick={handleEdit} size="medium">
                                    <EditNoteTwoToneIcon fontSize="inherit"/>
                                </IconButton>
                            </TableCell>
                            <TableCell align='right'>
                                <IconButton id={product.pid} onClick={()=> handleDelete(product.pid)}>
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