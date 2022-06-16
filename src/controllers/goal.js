const express = require('express');
const Goal = require('../models/Goal');

const router = express.Router();

router.get("/goals", verifyToken, async (req, res, next) => {
    return res.status(200).json(req.goals);
});

router.put("/goals/updateCompletionStatus", async (req, res, next) => {
    
})

router.post("/goals/add", verifyToken, async (req, res, next) => {
    const goals = req.user.goals;
    const { goalType, goal } = req.body;
    if (goalType === "short") {
        goals.shortTerm.push(goal);
    } else if (goalType === "mid") {
        goals.midTerm.push(goal);
    } else if (goalType === "long") {
        goals.longTerm.push(goal);
    } else {
        return res.status(422).json({ message: "Goal type is not specified correctly" });
    }
    await goals.save().then((g) => {
        return res.status(200).json({ message: "Goal added successfully. All the best to achieve it!!" });
    }).catch((err) => {
        return res.status(422).json({ err });
    });;
});

module.exports = router;