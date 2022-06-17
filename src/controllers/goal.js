const express = require('express');
const Goal = require('../models/Goal');

const router = express.Router();

router.get("/goals", verifyToken, async (req, res, next) => {
    return res.status(200).json(req.goalManagement);
});

router.put("/goals/updateTitle", verifyToken, async (req, res, next) => {
    const { goalId, title } = req.query;
    const goalManagement = req.goalManagement;
    await Goal.findOneAndUpdate({ id: goalId, goalManagementId: goalManagement._id }, { $set: { title: title } }).then((g) => {
        if (!g) return res.status(404).json({ message: "Goal not found!!" });
        return res.status(200).json({ message: "Title updated successfully" });
    });
});

router.put("/goals/updateCompletionStatus", verifyToken, async (req, res, next) => {
    const { goalId, completionStatus } = req.query;
    const goalManagement = req.goalManagement;
    await Goal.findOneAndUpdate({ id: goalId, goalManagementId: goalManagement._id }, { $set: { completionStatus: completionStatus } }).then((g) => {
        if (!g) return res.status(404).json({ message: "Goal not found!!" });
        return res.status(200).json({ message: "Completion Status updated successfully" });
    });
});

router.put("/goals/updateRemarks", verifyToken, async (req, res, next) => {
    const { goalId, remarks } = req.query;
    const goalManagement = req.goalManagement;
    await Goal.findOneAndUpdate({ id: goalId, goalManagementId: goalManagement._id }, { $set: { remarks: remarks } }).then((g) => {
        if (!g) return res.status(404).json({ message: "Goal not found!!" });
        return res.status(200).json({ message: "Remarks updated successfully" });
    });
});

router.put("/goals/updateDeadline", verifyToken, async (req, res, next) => {
    const { goalId, deadline } = req.query;
    const goalManagement = req.goalManagement;
    await Goal.findOneAndUpdate({ id: goalId, goalManagementId: goalManagement._id }, { $set: { deadline: deadline } }).then((g) => {
        if (!g) return res.status(404).json({ message: "Goal not found!!" });
        return res.status(200).json({ message: "Deadline updated successfully" });
    });
});

router.delete("/goals", verifyToken, async (req, res, next) => {
    const { goalId, goalType } = req.query;
    const goalManagement = req.goalManagement;
    if (goalType === 'shortTerm' || goalType === 'midTerm' || goalType === 'longTerm') {
        await Goal.findOneAndDelete({ id: goalId, goalManagementId: goalManagement._id }).then(async (g) => {
            let goalIndex = -1;
            if (!g) return res.status(404).json({ message: "Goal not found!!" });
            for (let i = 0; i < goalManagement[goalType].length; i++) {
                if (goalManagement[goalType][i]._id.toString() == g._id.toString()) {
                    goalIndex = i;
                    break;
                }
            }
            goalManagement[goalType].splice(goalIndex, 1);
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
    if (goalType === 'shortTerm' || goalType === 'midTerm' || goalType === 'longTerm') {
        const newGoal = new Goal({ ...goal, goalManagementId: goalManagement._id });
        await newGoal.save().then(async (g) => {
            goalManagement[goalType].push(g);
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