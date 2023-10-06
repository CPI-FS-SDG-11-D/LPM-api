const express = require("express");
const voteController = require('../controllers/voteController');
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

router.put('/upvote/:id', authentication, voteController.upvoteComplaint)
router.put('/downvote/:id', authentication, voteController.downvoteComplaint)
  
module.exports = router;