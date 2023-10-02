const express = require("express");
const userController = require('../controllers/userController');
const authentication = require('../middleware/authentication');

const router = express.Router();

/*
if route should be authenticate
add authentication function after url before controller
example: router.get('/profile', **authentication**, userController.profileUser)
*/

router.get('/profile', authentication, userController.profileUser)
router.get('/history', authentication, userController.historyUser)
  
module.exports = router;