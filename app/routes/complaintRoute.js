const express = require("express");
const router = express.Router();

<<<<<<< HEAD
const complaintController = require('../controllers/complaintController');

router.get("/", complaintController.getComplaints);

// router.get("/complaints", complaintController.loadComplaints);
router.post("/", complaintController.addComplaint);
router.get("/detail/:id", complaintController.detailComplaint);
router.get("/search/:title", complaintController.searchComplaint);
router.delete("/delete/:id", complaintController.deleteComplaint);

module.exports = router;
=======
const complaintController = require("../controllers/complaintController");
const authentication = require("../middleware/authentication");

router.get("/", complaintController.getComplaints);
router.post("/votes", complaintController.votes);

module.exports = router;
>>>>>>> origin/agi-task
