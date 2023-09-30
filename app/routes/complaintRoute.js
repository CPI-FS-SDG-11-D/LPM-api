const express = require("express");
const router = express.Router();

const complaintController = require('../controllers/complaintController');

router.get("/complaints", complaintController.loadComplaints);
router.post("/complaint", complaintController.addComplaint);
router.get("/complaint/detail/:id", complaintController.detailComplaint);
router.get("/complaint/search/:title", complaintController.searchComplaint);
router.delete("/complaint/delete/:id", complaintController.deleteComplaint);

module.exports = router;