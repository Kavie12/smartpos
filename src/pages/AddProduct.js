    import { Alert, Button, Checkbox, FormControlLabel, InputAdornment, Stack, TextField, Toolbar, Typography } from "@mui/material";
    import Divider from '@mui/material/Divider';
    import { useState } from "react";
    import axios from "axios";

    export default function AddProduct() {
        const [isChecked, setCheck] = useState(false);
        const [productDetails, setProductDetails] = useState({
            pName: "",
            price: ""
        });

        const [isSuccess, setSuccessState] = useState("");
        const [message, setMessage] = useState("");

        function handleInputs (e) {
            const {id, value} = e.target;
            setProductDetails(prevData => ({
                ...prevData,
                [id] : value
            }));  
        }

        function handleCheck(e) {
            const checkBoxState = e.target.checked;
            if(checkBoxState === true) {
                setCheck(true);
            }else {
                setCheck(false);
            }
        }

        function handleSubmit(e) {
            e.preventDefault();

            
            axios.post("http://localhost:5000/add", productDetails)
            .then(response => {
                setSuccessState("success");
                setMessage("The product added successfully mate!");
                console.log("Resonse from server: ", response.data);
            })
            .catch(error => {
                setSuccessState("error");
                setMessage("The product was not added successfully mate!");
                console.log("Error message from server: ", error);
            });

            // if(productDetails.pName !== "" && productDetails.price !== "") {
            //     alert("Submission complete! \n" + productDetails.pName + "\n" + productDetails.price);
                
            // }else {
            //     alert("Fill all the fields \n" + "MOTHERFUCKER");
            // }
        }

        return(<>
            <Typography variant="h4">Add Product</Typography>
            <Divider style={{margin: "10px 0px 0px 0px"}}/>
            <Toolbar style={{width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", margin: "30px 0px 0px 0px"}}>
                <form onSubmit={handleSubmit}>
                    <Stack direction="column" alignItems="center">

                        <TextField id="pName" label="Product Name" variant="outlined" color="success" style={{width: "650px"}}
                            value={productDetails.pName}
                            onChange={handleInputs}
                        />

                        <TextField
                            color="success"
                            label="Price"
                            id="price"
                            sx={{ m: 1, width: '650px' }}
                            slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">Rs.</InputAdornment>,
                                },
                            }}
                            variant="outlined"

                            value={productDetails.price}
                            onChange={handleInputs}
                        />

                        <FormControlLabel control={<Checkbox onChange={handleCheck} color="warning"/>} label="It's time to Add Product, double check before doing it!" />
                    </Stack>
                    <Button disabled={!isChecked} type="submit" variant="contained" color="success" style={{margin: "20px 0px 0px 0px", height: "45px", width: "100%"}}>Add the Product</Button>
                    <Alert severity={isSuccess} style={{marginTop: "10px", width: "95%"}}>{message}</Alert>
                </form>
                
            </Toolbar>
        </>);
    }