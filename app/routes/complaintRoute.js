const express = require("express");
const complaintController = require("../controllers/complaintController");
const authentication = require("../middleware/authentication");
const passAuthentication = require("../middleware/passAuthentication");

const router = express.Router();

/*
if route should be authenticate
add authentication function after url before controller
example: router.get('/profile', **authentication**, userController.profileUser)

if route should be authenticate but still request can be pass
add passAuthentication function after url before controller
example: router.get('/profile', **passAuthentication**, userController.profileUser)
*/

router.get("/", passAuthentication, complaintController.getComplaints);
router.get("/viral", passAuthentication, complaintController.getViralComplaints);
// router.get("/complaints", complaintController.loadComplaints);
router.post("/", authentication, complaintController.addComplaint);
router.post("/votes", authentication, complaintController.votes);
router.get("/search", passAuthentication, complaintController.searchComplaint);
router.get("/:id", passAuthentication, complaintController.detailComplaint);
router.put("/:id/update-status", authentication, complaintController.updateComplaint);
router.delete("/:id", authentication, complaintController.deleteComplaint);

module.exports = router;