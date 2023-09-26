const express = require("express");
const userController = require('../controllers/userController');
const authentication = require('../middleware/authentication');

const router = express.Router();

/*
if route should be authenticate
add authentication function after url before controller
example: router.get('/profile', **authentication**, userController.profileUser)
*/

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/profile', authentication, userController.profileUser)
  
module.exports = router;