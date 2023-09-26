require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./app/config/db');

// Import Routes
const userRoutes = require('./app/routes/userRoute');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// List API
app.use('/api', cors(), userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
});