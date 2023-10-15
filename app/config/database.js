require('dotenv').config();

const mongoose = require("mongoose");
const url = process.env.URL_DATABASE; // Set URL MongoDB

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', () => {
    console.error.bind(console, 'Connection error:');
});

db.once('open', () => {
    console.log('Connected to Database');
}); 