const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

const router = express.Router();

router.post("/signup", async (req, res) => {
    const user = new User(req.body);
    await user.save().then((data) => {
        return res.status(201).send(data);
    }).catch((err) => {
        return res.status(422).send(err);
    });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    await User.findOne({ username }).then((user) => {
        if (user == null) return res.status(404).send("Invalid credentials");
        if (user['password'] == password) {
            const token = jwt.sign({ exp: Math.floor(Date.now() / 1000) + (60 * 60), data: user['username'] }, "private");
            return res.status(200).send({ token, me: user });
        }
        return res.status(401).send("Invalid Credentials");
    });
})

module.exports = router;