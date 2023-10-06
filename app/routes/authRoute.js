const express = require("express");
const authController = require('../controllers/authController');
const authentication = require('../middleware/authentication');

const router = express.Router();

/*
if route should be authenticate
add authentication function after url before controller
example: router.get('/profile', **authentication**, authController.profileUser)
*/

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/update-password', authentication, authController.updatePasswordUser)
  
module.exports = router;