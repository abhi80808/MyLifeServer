const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const body_parser = require('body-parser');
const User = require('./src/models/User');

const app = express();

app.use(body_parser.json());

mongoose
    .connect("mongodb://localhost:27017/MyLife", { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to Database");
    })

var corsOptions = {
    origin: ['http://localhost:3000', 'http://172.16.58.153:3000'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.post("/user", async (req, res) => {
    const user = new User(req.body);
    await user.save().then((data) => {
        return res.status(201).send(data);
    }).catch((err) => {
        return res.status(422).send(err);
    });
})

app.get("*", (req, res) => {
    res.status(404).send("Error 404! not found");
});

app.post("*", (req, res) => {
    res.status(404).send("Error 404! not found");
});

app.delete("*", (req, res) => {
    res.status(404).send("Error 404! not found");
});

app.put("*", (req, res) => {
    res.status(404).send("Error 404! not found");
});

app.patch("*", (req, res) => {
    res.status(404).send("Error 404! not found");
});

app.listen(8080, () => {
    console.log("server is up and running on port 8080");
});