require('dotenv').config();

const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
// const ComplaintsByUserId = require('../services/aggregateComplaintsByUserIdService');
const Complaint = require("../models/Complaint");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
  
async function profileUser(req, res){
    const reqUser = req.user;

    try {
        const user = await User.find({ _id: reqUser.userId }, 'username email urlPhoto');

        res.status(200).json({ user: user });
    } catch (err) {
        console.error('Error profile user:', err);
        res.status(404).json({ message: 'User not found' });
    }
}

async function photoUser(req, res){
    const reqUser = req.user;
    const reqFile = req.file;

    try {
        const result = await cloudinary.uploader.upload(reqFile.path, { folder: 'profile', max_file_size: 2097152 });

        res.status(200).json({ urlPhoto: result.secure_url });
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ message: 'Error uploading image' });
    }
}

async function historyUser(req, res){
    const reqUser = req.user;
    const user = await User.find({ _id: reqUser.userId }, 'username'); // Get username from user

    try {
        // const complaints = await ComplaintsByUserId.aggregateComplaintsByUserId(user[0].username);
        const complaints = await Complaint.find({ userID: reqUser.userId }, 'title status totalUpvotes totalDownvotes createdAt').sort({ created_at: -1 });

        res.status(200).json({ complaints: complaints });
    } catch (err) {
        console.error('Error get complaints:', err);
        res.status(404).json({ message: 'Complaints not found' });
    }
}

module.exports = { profileUser, photoUser, historyUser }