const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const body_parser = require('body-parser');

const authRoutes = require('./src/controllers/auth');
const fundRoutes = require('./src/controllers/fund');

const app = express();

app.use(body_parser.json());

mongoose
    .connect("mongodb://localhost:27017/MyLife", { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to Database");
    })

var corsOptions = {
    origin: ['http://localhost:2500', 'http://172.16.58.76:2500'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use("/", authRoutes);
app.use("/", fundRoutes);

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

app.listen(2600, () => {
    console.log("server is up and running on port 2600");
});