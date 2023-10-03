const express = require("express");
const router = express.Router();

const complaintController = require("../controllers/complaintController");
const authentication = require("../middleware/authentication");

router.get("/", complaintController.getComplaints);
router.post("/votes", complaintController.votes);

module.exports = router;
