const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const PORT = 5000;
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "product_management_system"
});

db.connect(error => {
    if(error) {
        console.log("Error occurred while connecting to the database!");
    }else {
        console.log("Database connection successfully!");
    }
});

//Add product
app.post("/add", (req, res) => {
    const {pName, price} = req.body;
    const query = "INSERT INTO products(pName, price) VALUES(?, ?)";

    db.query(query, [pName, price], (error, result)=> {
        if(error) {
            console.error("Error while inserting data: ", error);
            return res.status(500).json({message: "Database error!"});
        }
        
        console.log("Data inserted successfully!");
        return res.status(200).json({message: "Product added successfully!"});
    });

    //test logging
    //const {productName, productPrice} = req.data;
    //console.log("Request arrived with the data: ", productName, productPrice);

    //Sending a response to the request "localhost:5000/add"
    //res.send("Post request called!");
});

//Get products
app.get("/getProducts", (req, res)=> {
    const query = "SELECT * FROM products";

    try {
        db.query(query, (error, result) => {
            if(error) {
                console.log("Error while fetching the data from database!");
                return res.status(500).json({message: "Fucked up while fetching data!"});
            }
            
            //success full response(fetched data)
            return res.status(200).json(result);
        });
    }catch(err) {
        console.log("Error detected in get request in server");
    }
});

//delete product
app.delete("/deleteProduct", (req, res) => {
    const {id} = req.body;

    const query = "DELETE FROM products WHERE pid = ?";

    db.query(query, [id], (error, result) => {
        if(error) {
            return res.status(403).json({message: "Product deletion unsuccessfully!"});
        }

        return res.status(200).json({message: "Product deletion successfully!"}); 
    });
});


app.listen(PORT, () => {
    console.log(`Server running on and listening http://localhost:${PORT}`);
  });
