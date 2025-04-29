    import * as React from 'react';
    import { useEffect, useState } from 'react';
    import Table from '@mui/material/Table';
    import TableBody from '@mui/material/TableBody';
    import TableCell from '@mui/material/TableCell';
    import TableContainer from '@mui/material/TableContainer';
    import TableHead from '@mui/material/TableHead';
    import TableRow from '@mui/material/TableRow';
    import Paper from '@mui/material/Paper';
    import { Divider, Icon, Menu, Stack, Typography,} from '@mui/material';
    import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
    import IconButton from '@mui/material/IconButton';
    import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
    import axios from 'axios';
    import Box from '@mui/material/Box';
    import ClickAwayListener from '@mui/material/ClickAwayListener';
    import { Button, Input } from '@mui/joy';

    export default function ProductList() {
        const [products, setProducts] = useState([]);
        const [anchorEl, setAnchorEl] = useState(null);
        const [selectedProduct, setSelectedProduct] = useState(null);
        var open = Boolean(anchorEl);

        const styles = {
            position: 'absolute',
            top: 28,
            right: 0,
            left: 0,
            zIndex: 1,
            border: '1px solid',
            p: 1,
            bgcolor: 'background.paper',
        };

        const handleClick = (event, product) => {
            setAnchorEl(event.currentTarget);
            setSelectedProduct(product);
            console.log("Menu opens!");
        };

        const handleClose = () => {
            setAnchorEl(null);
            setSelectedProduct(null);
            console.log("Menu closes!");
        }

        //load products to the page
        useEffect(()=> {
            axios.get("http://localhost:5000/getProducts")
            .then(response => {
                setProducts(response.data);
                console.log("All good motherfucker");
            })
            .catch(error => {
                console.log("Got fucked while loading the products");
            });

        }, []);

        //Deleting request
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

        //Editing request
        function handleEdit() {
            alert("It is aobut to be Edit!");
        }

        return(
        <>
            <Typography variant="h4">Products List</Typography>
            <Divider style={{margin: "10px 0px 20px 0px"}}/>

        {/* Table (mui) */}
            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <TableContainer component={Paper} sx={{width: 1100, padding: 2}}>
                <Table sx={{ minWidth: 1000, /*, width: "50%"*/}} aria-label="simple table">
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
                                        <IconButton
                                            onClick={(e) => handleClick(e, product)}
                                            size="small"
                                            
                                        >
                                            <EditNoteTwoToneIcon />
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

                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries(formData.entries());
                            alert(JSON.stringify(formJson));
                        }}
                        >
                        <Stack spacing={1}>
                            <Input placeholder="Product Name" required />
                            <Input placeholder="Price"/>
                            <Button type="submit">Edit Product</Button>
                        </Stack>
                    </form>
                </Menu>
            </div>
        </>
        );
    }