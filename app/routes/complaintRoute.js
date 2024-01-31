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

router.get("/complaints", passAuthentication, complaintController.getComplaint);
router.get("/complaints/:id", passAuthentication, complaintController.getComplaintById);
router.get("/complaints/viral", passAuthentication, complaintController.getComplaintViral);
router.post("/complaints", authentication, complaintController.addComplaint);
router.put("/complaints/update-status/:id", authentication, complaintController.updateComplaint);
router.delete("/complaints/:id", authentication, complaintController.deleteComplaint);

module.exports = router;