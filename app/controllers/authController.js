const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const accessToken = require('../config/auth');

async function registerUser(req, res){
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOne({ email });

        if (user) {
            return res.status(401).json({ message: 'Email is already registered' });
        }

        const newUser = new User({ username: username, email: email, password: hashedPassword })
        await newUser.save();

        const token = jwt.sign({ userId : newUser._id }, accessToken, { expiresIn: '24h' });

        res.status(200).json({ access_token: token });
    } catch (err) {
        console.error('Error register user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function loginUser(req, res){
    const { email, password } = req.body;

    try {
        const user = await User.find({ email }, '_id password');
        const isPasswordValid = await bcrypt.compare(password, user[0].password);

        if(!isPasswordValid) {
            res.status(401).json({ message: 'Password not match' });
        } else {
            const token = jwt.sign({ userId : user[0]._id }, accessToken, {expiresIn: '24h'});

            res.status(200).json({ access_token: token });
        }
    } catch (err) {
        console.error('Error login user:', err);
        res.status(404).json({ message: 'User not found' });
    }
}

async function updatePasswordUser(req, res){
    const reqUser = req.user;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    try {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const user = await User.find({ _id: reqUser.userId }, 'password');
        const isPasswordValid = await bcrypt.compare(oldPassword, user[0].password);

        if(newPassword != confirmPassword || !isPasswordValid){
            res.status(401).json({ message: 'Password not match' });
        }

        await User.findByIdAndUpdate(reqUser.userId, { password: hashedNewPassword }, { new: true, runValidators: true });

        res.status(200).json({ message: 'Password successfully updated' });
    } catch (err) {
        console.error('Error login user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { registerUser, loginUser, updatePasswordUser }