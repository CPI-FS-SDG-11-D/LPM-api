const express = require("express");
const multer = require('multer'); 
const uploadImageController = require('../controllers/uploadImageController');
const authentication = require('../middleware/authentication');

const router = express.Router();
const uploadUser = multer({ dest: '/src/images/profile' });
const uploadComplaint = multer({ dest: '/src/images/complaint' });

/*
if route should be authenticate
add authentication function after url before controller
example: router.get('/profile', **authentication**, userController.profileUser)

if route should be authenticate but still request can be pass
add passAuthentication function after url before controller
example: router.get('/profile', **passAuthentication**, userController.profileUser)
*/

router.post('/upload-user', uploadUser.single('image'), authentication, uploadImageController.imageUser)
router.post('/upload-complaint', uploadComplaint.single('image'), authentication, uploadImageController.imageComplaint)
  
module.exports = router;