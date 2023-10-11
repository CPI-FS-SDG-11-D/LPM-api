const express = require("express");
const router = express.Router();

const complaintController = require('../controllers/complaintController');
const authentication = require("../middleware/authentication");

router.get("/", complaintController.getComplaints);

// router.get("/complaints", complaintController.loadComplaints);
router.post("/",authentication, complaintController.addComplaint);
router.post("/votes",authentication, complaintController.votes);
router.get("/detail/:id",authentication, complaintController.detailComplaint);
router.get("/search", complaintController.searchComplaint);
router.delete("/delete/:id", complaintController.deleteComplaint);

module.exports = router;
