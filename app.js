require("dotenv").config();
require("./app/config/database");

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestLog = require('./app/middleware/requestLog');

// Import Routes
const authRoutes = require("./app/routes/authRoute");
const userRoutes = require("./app/routes/userRoute");
const complaintRoutes = require("./app/routes/complaintRoute");

const app = express();
const port = process.env.PORT; // Set Port Server

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLog);

// List API
app.use("/api", cors(), authRoutes);
app.use("/api", cors(), userRoutes);
app.use("/api/complaints", cors(), complaintRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
