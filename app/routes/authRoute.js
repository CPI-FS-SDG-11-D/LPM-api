const express = require("express");
const authController = require('../controllers/authController');
const authentication = require('../middleware/authentication');

const router = express.Router();

/*
if route should be authenticate
add authentication function after url before controller
example: router.get('/profile', **authentication**, userController.profileUser)

if route should be authenticate but still request can be pass
add passAuthentication function after url before controller
example: router.get('/profile', **passAuthentication**, userController.profileUser)
*/

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/update-password', authentication, authController.updatePasswordUser)
  
module.exports = router;