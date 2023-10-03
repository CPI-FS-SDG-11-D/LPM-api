const User = require('../models/User');
const Complaint = require("../models/Complaint");
const Feedback = require('../models/Feedback');

async function profileUser(req, res){
    const reqUser = req.user;

    try {
        const user = await User.findOne({ _id: reqUser.userId }, 'username email');

        res.status(200).json({ user: user });
    } catch (err) {
        console.error('Error profile user:', err);
        res.status(404).json({ message: 'User not found' });
    }
}

async function historyUser(req, res){
    const reqUser = req.user;

    try {
        const feedbacks = await Feedback.find({ userID: reqUser.userId }).sort({ created_at: -1 });

        res.status(200).json({ feedbacks: feedbacks });
    } catch (err) {
        console.error('Error get feedbacks:', err);
        res.status(404).json({ message: 'Complaints not found' });
    }
}

module.exports = { profileUser, historyUser }