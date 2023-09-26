require('dotenv').config();

const jwt = require('jsonwebtoken');
const accessToken = process.env.SECRET_TOKEN;

async function authentication(req, res, next) {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]
  
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
        const decodedToken = jwt.verify(token, accessToken);    
        req.user = decodedToken;
    
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

module.exports = authentication