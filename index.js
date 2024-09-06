const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const userRoute = require("./Routes/UserRoutes.js");
const adminroutes = require("./Routes/adminroutes.js");
const cors = require('cors');
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());

// Body-parser middleware (for parsing JSON and URL-encoded data)
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));

// Morgan for logging requests
app.use(morgan("dev"));

// Define routes
app.use("/user", userRoute); 
app.use("/admin", adminroutes);

// Root route (responding to the base URL)
app.get("/", (req, res) => {
    res.send('Server is running');
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.mongoDB_URL, {})
    .then(() => {
        app.listen(process.env.Port, () => {
            console.log("Server is up and running");
            console.log("Connected to the database");
        });
    })
    .catch((err) => {
        console.log(err.message);
    });
