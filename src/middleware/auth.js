const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Finance = require('../models/Finance');
const DayManagement = require('../models/DayManagement');
const Goal = require('../models/Goal');

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
            path: "goals",
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
            if(!req.user.goals) {
                const goal = new Goal();
                await goal.save().then(async (g) => {
                    user.goals = g._id;
                    await user.save();
                    req.user = user;
                });
            }
            req.goals = await Goal.findOne({ _id: req.user.goals._id });
        });
    }
    catch (e) {
        return res.status(404).json(e);
    }
    next();
}