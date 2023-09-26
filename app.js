const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

//import Router
const userRoutes = require("./routes/user.route");
const complaintRoutes = require("./routes/complaint.route");
const { loadComplaints } = require("./controller/complaint.controller");

//set up mongodb + mongoose
const mongoose = require("mongoose");
const DB_URL = "mongodb+srv://test-user:1sampai8@clustertest.4qpnuk7.mongodb.net/CPI-FS-SDG-11-D";
mongoose.connect(DB_URL);
const db = mongoose.connection;

db.on('error',(err) => {
    console.log(err);
});

db.once('connected', () => {
  console.log("DB CONNECTED");
});

app.get("/", async (_, res) => {
  try {
  const allComplaints = await loadComplaints();
  res.status(200).json(allComplaints);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.use("/users", userRoutes);
app.use("/complaints", complaintRoutes);

app.use("/", (_, res) => {
  res.status(404).send("<h1>PAGE NOT FOUND</h1>");
});

app.listen(port, () => {
  console.log(`listen to port: ${port}`);
});