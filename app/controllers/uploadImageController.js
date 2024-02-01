require('dotenv').config();

const cloudinary = require('../config/cloudinary');
const User = require('../models/User');

async function imageUser(req, res){
    const reqUser = req.user;
    const reqFile = req.file;

    try {
        const result = await cloudinary.uploader.upload(reqFile.path, { folder: 'profile', max_file_size: 2097152 });

        if(result.secure_url) {
            await User.findByIdAndUpdate(reqUser.userId , { urlUser: result.secure_url }, { new: true, runValidators: true });
        }
        res.status(201).json({ urlUser: result.secure_url });

    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ message: 'Error uploading image' });
    }
}

async function imageComplaint(req, res){
    const reqFile = req.file;

    try {
        const result = await cloudinary.uploader.upload(reqFile.path, { folder: 'complaint', max_file_size: 2097152 });

        res.status(201).json({ urlComplaint: result.secure_url });
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ message: 'Error uploading image' });
    }
}

module.exports = { imageUser, imageComplaint }