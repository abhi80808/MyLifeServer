const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    const username = jwt.verify(token, 'private')['data'];
    req.user = await User.find({username});
    next();
}