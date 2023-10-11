require('dotenv').config();
require('./app/config/database');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Import Routes
const authRoutes = require('./app/routes/authRoute');
const userRoutes = require('./app/routes/userRoute');
const complaintRoutes = require('./app/routes/complaintRoute');
const voteRoutes = require('./app/routes/voteRoute');

const app = express();
const port = process.env.PORT; // Set Port Server

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// List API
app.use('/api', cors(), authRoutes);
app.use('/api', cors(), userRoutes);
app.use('/api/complaints', cors(), complaintRoutes);
app.use('/api', cors(), voteRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});