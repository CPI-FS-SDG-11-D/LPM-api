const express = require("express");
const router = express.Router();

const complaintController = require('../controllers/complaintController');
const authentication = require("../middleware/authentication");
const passAuthentication = require("../middleware/passAuthentication");

router.get("/", complaintController.getComplaints);

// router.get("/complaints", complaintController.loadComplaints);
router.post("/",authentication, complaintController.addComplaint);
router.post("/votes",authentication, complaintController.votes);
router.get("/:id",passAuthentication, complaintController.detailComplaint);
router.get("/search", complaintController.searchComplaint);
router.delete("/:id",authentication, complaintController.deleteComplaint);

module.exports = router;
