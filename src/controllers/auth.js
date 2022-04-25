const express = require('express');
const User = require('../models/User');

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
        if(user == null) return res.status(404).send("Invalid credentials");
        if(user['password'] == password) return res.status(200).json({token: user['_id']});
    });
    // return res.status(200).json("fasd");
})

module.exports = router;