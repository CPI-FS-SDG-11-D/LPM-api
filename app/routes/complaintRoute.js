const express = require("express");

const authentication = require("../middleware/authentication");
const passAuthentication = require("../middleware/passAuthentication");
const complaintController = require("../controllers/complaintController");

const router = express.Router();

/*
if route should be authenticate
add authentication function after url before controller
example: router.get('/profile', **authentication**, userController.profileUser)

if route should be authenticate but still request can be pass
add passAuthentication function after url before controller
example: router.get('/profile', **passAuthentication**, userController.profileUser)
*/

router.post("/complaints", authentication, complaintController.addComplaint);
router.get("/complaints", passAuthentication, complaintController.getComplaints);
router.get("/complaints/viral", passAuthentication, complaintController.getViralComplaints);
router.get("/complaints/search", passAuthentication, complaintController.searchComplaint);
router.get("/complaints/:id", passAuthentication, complaintController.detailComplaint);
router.put("/complaints/:id/update-status", authentication, complaintController.updateComplaint);
router.delete("/complaints/:id", authentication, complaintController.deleteComplaint);

module.exports = router;