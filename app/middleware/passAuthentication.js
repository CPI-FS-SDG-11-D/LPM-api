require('dotenv').config();

const jwt = require('jsonwebtoken');
const accessToken = process.env.SECRET_TOKEN; // Set Secret Token

async function passAuthentication(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
  
    try {
        const decodedToken = jwt.verify(token, accessToken);    
        req.user = decodedToken;
    
        next();
    } catch (error) {
        next();
    }
}

module.exports = passAuthentication