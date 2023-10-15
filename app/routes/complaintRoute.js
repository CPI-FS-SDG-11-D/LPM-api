const express = require("express");
const router = express.Router();

const complaintController = require('../controllers/complaintController');
const authentication = require("../middleware/authentication");
const passAuthentication = require("../middleware/passAuthentication");


router.get("/", passAuthentication, complaintController.getComplaints);
// router.get("/complaints", complaintController.loadComplaints);
router.post("/",authentication, complaintController.addComplaint);
router.post("/votes",authentication, complaintController.votes);
router.get("/search",passAuthentication, complaintController.searchComplaint);
router.get("/:id",passAuthentication, complaintController.detailComplaint);
router.put("/:id/update-status", authentication, complaintController.updateComplaint);
router.delete("/:id",authentication, complaintController.deleteComplaint);

module.exports = router;
