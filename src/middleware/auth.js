const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Finance = require('../models/Finance');
const DayManagement = require('../models/DayManagement');
const GoalManagement = require('../models/GoalManagement');

module.exports = verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "You are not authorized to perform this task" });
    try {
        const username = jwt.verify(token, 'private')['data'];
        await User.findOne({ username }).populate([{
            path: "finance",
            select: "-__v",
            populate: {
                path: "funds",
                select: "-_id -__v"
            }
        }, {
            path: "dayManagement",
            select: "-__v"
        }, {
            path: "goalManagement",
            select: "-__v"
        }]).then(async (user) => {
            req.user = user;
            req.finance = await Finance.findOne({ _id: req.user.finance._id }).populate([{
                path: "funds",
                select: "-__v"
            }, { path: "selfTransferLog", select: "-__v" }]);
            req.dayManagement = await DayManagement.findOne({ _id: req.user.dayManagement._id }).populate([
                {
                    path: "dailyTasks",
                    select: "-__v"
                }
            ]);
            if(!req.user.goalManagement) {
                const goalManagement = new GoalManagement();
                await goalManagement.save().then(async (gM) => {
                    user.goalManagement = gM._id;
                    await user.save();
                    req.user = user;
                });
            }
            req.goalManagement = await GoalManagement.findOne({ _id: req.user.goalManagement._id }).populate([
                {
                    path: "shortTerm",
                    select: "-__v"
                }, {
                    path: "midTerm",
                    select: "-__v"
                }, {
                    path: "longTerm",
                    select: "-__v"
                }
            ]);
        });
    }
    catch (e) {
        return res.status(404).json(e);
    }
    next();
}