require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const accessToken = process.env.SECRET_TOKEN;

async function registerUser(req, res){
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Encrypt password
    const existingUser = await User.findOne({ email }); // Find user email in database

    if (existingUser) {
        return res.status(401).json({ message: 'Email is already registered' });
    }

    try {
        const newUser = new User({ username: username, email: email, password: hashedPassword })
        await newUser.save();

        const token = jwt.sign({ userId : newUser._id }, accessToken, { expiresIn: '24h' }); // Generate JWT Token

        res.status(200).json({ token: token });
    } catch (err) {
        console.error('Error register user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function loginUser(req, res){
    const { email, password } = req.body;

    try {
        const user = await User.find({ email }, '_id password'); // Find user in database
        const isPasswordValid = await bcrypt.compare(password, user[0].password); // Match password

        if(!isPasswordValid) {
            res.status(401).json({ message: 'Password not match' });
        } else {
            const token = jwt.sign({ userId : user[0]._id }, accessToken, {expiresIn: '24h'}); // Generate JWT Token

            res.status(200).json({ token: token });
        }
    } catch (err) {
        console.error('Error login user:', err);
        res.status(404).json({ message: 'User not found' });
    }
}

async function updatePasswordUser(req, res){
    const reqUser = req.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Encrypt password
    const user = await User.find({ _id: reqUser.userId }, 'password'); // Find user in database
    const isPasswordValid = await bcrypt.compare(oldPassword, user[0].password); // Match password

    if(newPassword != confirmPassword){
        res.status(401).json({ message: 'Password not match' });
    }

    if(!isPasswordValid) {
        res.status(401).json({ message: 'Password not match' });
    }

    try {
        await User.findByIdAndUpdate(reqUser.userId, { password: hashedNewPassword }, { new: true, runValidators: true }); // Update password user

        res.status(200).json({ message: 'Password successfully updated' });
    } catch (err) {
        console.error('Error login user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { registerUser, loginUser, updatePasswordUser }