const express = require("express");
const router = express.Router();

const complaintController = require('../controllers/complaintController');

router.get("/", complaintController.getComplaints);

// router.get("/complaints", complaintController.loadComplaints);
router.post("/", complaintController.addComplaint);
router.get("/detail/:id", complaintController.detailComplaint);
router.get("/search/:title", complaintController.searchComplaint);
router.delete("/delete/:id", complaintController.deleteComplaint);

module.exports = router;