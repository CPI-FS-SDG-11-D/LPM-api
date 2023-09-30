require('dotenv').config();
require('./app/config/database');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import Routes
const userRoutes = require('./app/routes/userRoute');
const complaintRoutes = require('./app/routes/complaintRoute');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// List API
app.use('/api', cors(), userRoutes);
app.use('/api/complaints', cors(), complaintRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});