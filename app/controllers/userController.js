const User = require('../models/User');
const Complaint = require("../models/Complaint");

async function profileUser(req, res){
    const reqUser = req.user;

    try {
        const user = await User.find({ _id: reqUser.userId }, 'username email');

        res.status(200).json({ user: user });
    } catch (err) {
        console.error('Error profile user:', err);
        res.status(404).json({ message: 'User not found' });
    }
}

async function historyUser(req, res){
    const reqUser = req.user;

    try {
        const complaints = await Complaint.find({ userID: reqUser.userId })
                        .select('userID title description status totalUpvotes totalDownvotes createdAt')
                        .sort({ created_at: -1 });

        res.status(200).json({ complaints: complaints });
    } catch (err) {
        console.error('Error get complaints:', err);
        res.status(404).json({ message: 'Complaints not found' });
    }
}

module.exports = { profileUser, historyUser }