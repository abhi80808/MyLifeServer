const express = require('express');
const DailyTask = require('../models/DailyTask');
const DayManagement = require('../models/DayManagement');

const router = express.Router();

router.get("/dailyTasks", verifyToken, async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate) throw new Error("Start Date is not provided");
        if (!endDate) throw new Error("End Date is not provided");
        const dailyTasks = await DailyTask.find({ dayManagementId: req.dayManagement._id, date: { $gte: new Date(startDate), $lte: new Date(endDate) } }).select("-dayManagementId");
        return res.status(200).json(dailyTasks);
    } catch (err) {
        return res.status(400).json(err.message);
    }
});

router.post("/dailyTask/add", verifyToken, async (req, res, next) => {
    const dayManagement = req.user.dayManagement;
    const dailyTask = new DailyTask({ ...req.body, dayManagementId: dayManagement._id });
    await dailyTask.save().then(async (dailyTaskData) => {
        dayManagement.dailyTasks.push(dailyTaskData._id);
        await dayManagement.save().then((dayManagementData) => {
            return res.status(200).json({ message: "Successfully added task" });
        }).catch((err) => {
            return res.status(422).json({ err });
        })
    }).catch((err) => {
        return res.status(422).json({ err });
    });
});

router.put("/dailyTask/updateCompletionStatus", verifyToken, async (req, res, next) => {
    const { dailyTaskId, taskSNo, completionStatus } = req.query;
    const dayManagement = req.dayManagement;
    let dailyTask = {};
    dayManagement['dailyTasks'].every(dt => {
        if (dt.id == dailyTaskId) {
            dailyTask = dt;
            return false;
        }
        return true;
    });
    const taskIndex = dailyTask.tasks.findIndex((task => task.sNo == taskSNo));
    dailyTask.tasks[taskIndex].completionStatus = completionStatus;
    await dailyTask.save().then(() => {
        return res.status(200).json({ message: "Task completion status updated successfully!!" });
    });
});

router.put("/dailyTask/updateRemarks", verifyToken, async (req, res, next) => {
    const { dailyTaskId, taskSNo, remarks } = req.query;
    const dayManagement = req.dayManagement;
    let dailyTask = {};
    dayManagement['dailyTasks'].every(dt => {
        if (dt.id == dailyTaskId) {
            dailyTask = dt;
            return false;
        }
        return true;
    });
    const taskIndex = dailyTask.tasks.findIndex((task => task.sNo == taskSNo));
    dailyTask.tasks[taskIndex].remarks = remarks;
    await dailyTask.save().then(() => {
        return res.status(200).json({ message: "Task remarks updated successfully!!" });
    });
});

router.delete("/dailyTasks", verifyToken, async (req, res, next) => {
    const { dailyTaskId } = req.query;
    const dayManagement = req.dayManagement;
    await DailyTask.findOneAndDelete({ id: dailyTaskId, dayManagementId: dayManagement._id }).then(async (dt) => {
        let dailyTaskIndex = -1;
        if (!dt) return res.status(404).json({ message: "Daily Task not found!!" });
        for (let i = 0; i < dayManagement.dailyTasks.length; i++) {
            if (dayManagement.dailyTasks[i]._id.toString() == dt._id.toString()) {
                dailyTaskIndex = i;
                break;
            }
        }
        dayManagement.dailyTasks.splice(dailyTaskIndex, 1);
        await dayManagement.save().then(() => {
            return res.status(200).json({ message: "Daily Task deleted successfully!!" });
        })
    })
})

// router.delete("/dailyTasks/subTask", verifyToken, async (req, res, next) => {
//     const { dailyTaskId, taskSno } = req.query;
//     const dayManagement = req.dayManagement;
//     await DailyTask.findOne({ id: dailyTaskId, dayManagementId: dayManagement._id }).then(async (dt) => {
//         if (!dt) return res.status(404).json({ message: "Daily Task Not found" });
//         let subTaskIndex = -1;
//         for (let i = 0; i < dt.tasks.length; i++) {
//             if (dt.tasks[i].sNo == taskSno) {
//                 subTaskIndex = i;
//                 break;
//             }
//         }
//         dt.tasks.splice(subTaskIndex, 1);
//         await dt.save().then(() => {
//             return res.status(200).json({ message: "Sub Task Deleted successfully!!" });
//         })
//     });
// })

module.exports = router;