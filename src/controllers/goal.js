const express = require('express');
const Goal = require('../models/Goal');
const GoalManagement = require('../models/GoalManagement');

const router = express.Router();

router.get("/goals", verifyToken, async (req, res, next) => {
    return res.status(200).json(req.goalManagement);
});

router.put("/goals/updateTitle", verifyToken, async (req, res, next) => {
    const { goalObjectId, title } = req.query;
    const goalManagement = req.goalManagement;
    await Goal.findOneAndUpdate({ id: goalObjectId, goalManagementId: goalManagement._id }, { $set: { title: title } }).then((g) => {
        return res.status(200).json({ message: "Completion Status updated successfully", g });
    });
});

router.put("/goals/updateCompletionStatus", verifyToken, async (req, res, next) => {
    const { goalObjectId, completionStatus } = req.query;
    const goalManagement = req.goalManagement;
    await Goal.findOneAndUpdate({ id: goalObjectId, goalManagementId: goalManagement._id }, { $set: { completionStatus: completionStatus } }).then((g) => {
        return res.status(200).json({ message: "Completion Status updated successfully", g });
    });
});

router.put("/goals/updateRemarks", verifyToken, async (req, res, next) => {
    const { goalObjectId, remarks } = req.query;
    const goalManagement = req.goalManagement;
    await Goal.findOneAndUpdate({ id: goalObjectId, goalManagementId: goalManagement._id }, { $set: { remarks: remarks } }).then((g) => {
        return res.status(200).json({ message: "Remarks updated successfully", g });
    });
});

router.put("/goals/updateDeadline", verifyToken, async (req, res, next) => {
    const { goalId, deadline } = req.query;
    const goalManagement = req.goalManagement;
    await Goal.findOneAndUpdate({ id: goalId, goalManagementId: goalManagement._id }, { $set: { deadline: deadline } }).then(() => {
        return res.status(200).json({ message: "Completion Status updated successfully" });
    });
});

router.delete("/goals", verifyToken, async (req, res, next) => {
    const { goalId, goalType } = req.query;
    const goalManagement = req.goalManagement;
    // return res.json(goalManagement);
    if (goalType === 'short' || goalType === 'mid' || goalType === 'long') {
        await Goal.findOneAndDelete({ id: goalId, goalManagementId: goalManagement._id }).then(async (g) => {
            const goalIndex = -1;
            if(!g) return res.status(404).json({message: "Goal not found!!"});
            for (let i = 0; i < goalManagement[goalType + 'Term'].length; i++) {
                if (goalManagement[goalType + 'Term'][i]._id == g._id) {
                    goalIndex = i;
                    break;
                }
            }
            goalManagement[goalType + 'Term'].splice(goalIndex, 1);
            // console.log(goalManagement);
            await goalManagement.save().then(() => {
                return res.status(200).json({ message: "Goal deleted successfully!!" });
            })
        })
    } else {
        return res.status(422).json({ message: "Goal type not specified correctly!!" });
    }
});

router.post("/goals/add", verifyToken, async (req, res, next) => {
    const goalManagement = req.goalManagement;
    const { goalType, goal } = req.body;
    if (goalType === 'short' || goalType === 'mid' || goalType === 'long') {
        const newGoal = new Goal({ ...goal, goalManagementId: goalManagement._id });
        await newGoal.save().then(async (g) => {
            goalManagement[goalType + 'Term'].push(g);
            await goalManagement.save().then(() => {
                return res.status(200).json({ message: "Goal added successfully. All the best to achieve it!!" });
            }).catch((err) => {
                return res.status(422).json({ message: "a", err })
            })
        }).catch((err) => {
            return res.status(422).json({ message: "b", err });
        })
    } else {
        return res.status(422).json({ message: "Goal type is not specified correctly" });
    }
});

module.exports = router;