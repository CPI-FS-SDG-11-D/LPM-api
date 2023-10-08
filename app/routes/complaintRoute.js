const express = require("express");
const router = express.Router();

const complaintController = require("../controllers/complaintController");
const authentication = require("../middleware/authentication");

router.get("/", complaintController.getComplaints);
router.post("/votes", authentication, complaintController.votes);

module.exports = router;
