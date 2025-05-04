import { Style } from "@mui/icons-material";
import { Box, Button, Checkbox, Divider, FormControlLabel, Paper, TextField, Typography } from "@mui/material";
//import React, { useState } from "react";
import { Link } from "react-router";

export default function EmployeeProfile() {

    const nameOfMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours > 12? "PM": "AM";

    return (<>
        <Typography variant="h4" fontWeight="bold">Account & Setting</Typography>

        <Typography  sx={{color: "grey", fontSize: "12px", margin: "5px 0px 20px 0px"}}> {hours}:{minutes} {amOrPm}, {day} {nameOfMonths[month]} {year}</Typography>

        {/*Scroll pane*/ }
       <Box sx={{width: "100%", overflowY: "scroll", overflowX: "hidden", height: "100%"}}>
            <Link style={{fontSize: "10", color: "grey", textDecoration: "none", marginRight: "8px"}} to="">Genaral</Link>

            <Divider orientation="horizontal" sx={{mt: 0.5, mb: 2}} variant="middle" flexItem />

            <Box id="profile_container" sx={{display: "flex", justifyContent: "center", width: "100%"}}>
                <Paper sx={{display: "flex", flexDirection: "row", width: "50%", padding: "10px", borderRadius: "20px"}}>
                    <Box sx={{width: "25%"}}> 
                        <Typography variant="h5" fontWeight="bold" style={{margin: "20px 0px 0px 10px"}}>Basic Details</Typography>
                    </Box>

                    <Divider orientation="vertical" variant="middle" flexItem />

                    <Box sx={{width: "75%", display: "flex", flexDirection: "column", alignItems: "center", margin: "5px 0px 20px 0px"}}> 
                        <TextField sx={{width: "75%", margin: "10px 0px 2px 0px"}} id="firstName" label="First Name" variant="outlined" />
                        <TextField sx={{width: "75%", margin: "10px 0px 10px 0px"}} id="lastName" label="Last Name" variant="outlined" />
                    </Box>

                    <FormControlLabel control={<Checkbox color="warning"/>} label="It's time to Add Product, double check before doing it!" />

                    <Button variant="contained" sx={{margin: "10px"}}>Save Changes</Button>
                </Paper>
            </Box>

            <Link style={{fontSize: "10", color: "grey", textDecoration: "none", marginRight: "8px"}} to="">Security</Link>
            <Divider orientation="horizontal" sx={{mt: 0.5, mb: 2}} variant="middle" flexItem />

            <Box id="profile_container" sx={{display: "flex", justifyContent: "center", width: "100%"}}>
                <Paper sx={{display: "flex", flexDirection: "row", width: "50%", padding: "10px", borderRadius: "20px"}}>
                        <Box sx={{width: "25%"}}> 
                            <Typography variant="h5" fontWeight="bold">Security</Typography>
                        </Box>

                        <Divider orientation="vertical" variant="middle" flexItem />

                        <Box sx={{width: "75%"}}> 

                        </Box>
                </Paper>
            </Box>
       </Box>
    </>);
}