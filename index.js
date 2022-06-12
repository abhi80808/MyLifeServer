const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const body_parser = require('body-parser');

const authRoutes = require('./src/controllers/auth');
const fundRoutes = require('./src/controllers/fund');
const dailyTaskRoutes = require('./src/controllers/dailyTask');
const dayManagementRoutes = require('./src/controllers/dayManagement');

const app = express();

app.use(body_parser.json());

const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/MyLife";
mongoose
    .connect(DB_URL, { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to Database");
    })

var corsOptions = {
    origin: ['http://172.16.58.76:2500', 'http://192.168.0.111:2500'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use("/", authRoutes);
app.use("/", fundRoutes);
app.use("/", dailyTaskRoutes);
app.use("/", dayManagementRoutes);

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

const PORT = process.env.PORT || 2600;
app.listen(PORT, () => {
    console.log("server is up and running on port 2600");
});