require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const User = require('../models/User');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
  
async function imageUser(req, res){
    const reqUser = req.user;
    const reqFile = req.file;

    try {
        const result = await cloudinary.uploader.upload(reqFile.path, { folder: 'profile', max_file_size: 2097152 });

        if(result.secure_url) {
            await User.findByIdAndUpdate(reqUser.userId , { urlUser: result.secure_url }, { new: true, runValidators: true }); // Update upvote complaint
        }
        res.status(200).json({ urlUser: result.secure_url });

    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ message: 'Error uploading image' });
    }
}

async function imageComplaint(req, res){
    const reqFile = req.file;

    try {
        const result = await cloudinary.uploader.upload(reqFile.path, { folder: 'complaint', max_file_size: 2097152 });

        res.status(200).json({ urlComplaint: result.secure_url });
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ message: 'Error uploading image' });
    }
}

module.exports = { imageUser, imageComplaint }