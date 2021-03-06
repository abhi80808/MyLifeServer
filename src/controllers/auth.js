const express = require('express');
const User = require('../models/User');
const Finance = require('../models/Finance');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/auth');
const SelfTransferLog = require('../models/SelfTransferLog');
const DayManagement = require('../models/DayManagement');

const router = express.Router();

router.get("/me", verifyToken, async (req, res, next) => {
    return res.status(200).send(req.user);
})

router.post("/signup", async (req, res) => {
    const userData = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(userData['password'], salt, async (err, hash) => {
            userData['password'] = hash;
            const selfTransferLog = new SelfTransferLog();
            await selfTransferLog.save().then(async (selfTransferLogData) => {
                const finance = new Finance({ selfTransferLog: selfTransferLogData._id });
                await finance.save().then(async (financeData) => {
                    const dayManagement = new DayManagement();
                    await dayManagement.save().then(async (dayManagementData) => {
                        const user = new User({ ...userData, finance: financeData._id, dayManagement: dayManagementData._id });
                        await user.save().then((data) => {
                            return res.status(201).send(data);
                        }).catch((err) => {
                            return res.status(422).send(err);
                        });
                    }).catch((err) => {
                        return res.status(422).json(err);
                    });
                }).catch((err) => {
                    return res.status(422).json(err);
                });
            });
        });
    });

});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    await User.findOne({ username }).then((user) => {
        if (user == null) return res.status(404).send("Invalid credentials");
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: user['username'] }, "private");
                return res.status(200).send({ token, me: user });
            }
            else return res.status(401).send("Invalid Credentials");
        });
    });
})

module.exports = router;