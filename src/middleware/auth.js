const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Finance = require('../models/Finance');

module.exports = verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) return res.status(401).json({message: "You are not authorized to perform this task"});
    const username = jwt.verify(token, 'private')['data'];
    req.user = await User.findOne({username}).populate('finance');
    req.finance = await Finance.findOne({_id: req.user.finance._id}).populate('funds');
    next();
}