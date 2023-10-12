const express = require("express");
const router = express.Router();

const complaintController = require("../controllers/complaintController");
const authentication = require("../middleware/authentication");
const passAuthentication = require("../middleware/passAuthentication");

router.get("/", passAuthentication, complaintController.getComplaints);
router.post("/votes", authentication, complaintController.votes);

module.exports = router;
