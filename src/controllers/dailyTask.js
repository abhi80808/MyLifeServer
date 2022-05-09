const express = require('express');
const DailyTask = require('../models/DailyTask');

const router = express.Router();

router.post("/dailyTask/add", verifyToken, async (req, res, next) => {
    const dayManagement = req.user.dayManagement;
    const dailyTask = new DailyTask(req.body);
    await dailyTask.save().then(async (dailyTaskData) => {
        dayManagement.dailyTasks.push(dailyTaskData._id);
        await dayManagement.save().then((dayManagementData) => {
            return res.status(200).json({message: "Successfully added task"});
        }).catch((err) => {
            return res.status(422).json({err});
        })
    }).catch((err) => {
        return res.status(422).json({err});
    });
});

router.put("/dailyTask/updateCompletionStatus", verifyToken, async (req, res, next) => {
    const {dailyTaskId, taskSNo, completionStatus} = req.query;
    return res.json({m:"route hit"});
})

module.exports = router;