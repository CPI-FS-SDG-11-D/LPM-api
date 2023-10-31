const express = require("express");
const multer = require('multer'); 

const authentication = require('../middleware/authentication');
const uploadImageController = require('../controllers/uploadImageController');

const router = express.Router();
const uploadUser = multer({ dest: 'src/images/user' });
const uploadComplaint = multer({ dest: 'src/images/complaint/' });

/*
if route should be authenticate
add authentication function after url before controller
example: router.get('/profile', **authentication**, userController.profileUser)

if route should be authenticate but still request can be pass
add passAuthentication function after url before controller
example: router.post('/upload-user', passAuthentication, uploadUser.single('image'), uploadImageController.imageUser)
*/

router.post('/upload-user', authentication, uploadUser.single('image'), uploadImageController.imageUser)
router.post('/upload-complaint', authentication, uploadComplaint.single('image'), uploadImageController.imageComplaint)
  
module.exports = router;