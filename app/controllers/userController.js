require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const accessToken = process.env.SECRET_TOKEN;

async function registerUser(req, res){
    const reqUser = req.body;
    const hashedPassword = await bcrypt.hash(reqUser.password, 10);

    const user = {
        username: reqUser.username,
        email: reqUser.email,
        password: hashedPassword
    }

    try {
        const newUser = new User(user)
        const saveUser = await newUser.save();

        // Generate JWT Token
        const token = jwt.sign({ username : user.username }, accessToken, {expiresIn: '24h'});

        res.status(200).json({ token: token });
    } catch (err) {
        console.error('Error register user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function loginUser(req, res){
    const reqUser = req.body;
    const user = {
        email: reqUser.email,
        password: reqUser.password
    }

    try {
        const users = await User.find({ email: user.email }, 'username email password');

        const isPasswordValid = await bcrypt.compare(user.password, users[0].password);

        if(!isPasswordValid) {
            res.status(404).json({ error: 'Password do not match' });
        } else {
            // Generate JWT Token
            const token = jwt.sign({ username : users[0].username }, accessToken, {expiresIn: '24h'});

            res.status(200).json({ token: token });
        }
    } catch (err) {
        console.error('Error login user:', err);
        res.status(404).json({ error: 'User not found' });
    }
}

async function profileUser(req, res){
    const reqUsername = req.user;

    try {
        const users = await User.find({ username: reqUsername.username }, 'username email');

        res.status(200).json({ user: users });
    } catch (err) {
        console.error('Error profile user:', err);
        res.status(404).json({ error: 'User not found' });
    }
}

module.exports = { registerUser, profileUser, loginUser }