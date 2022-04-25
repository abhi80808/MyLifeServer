const express = require('express');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: ['http://localhost:3000','http://172.16.58.153:3000'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.get("*", (req, res) => {
    res.send("Error 404! not found");
});

app.post("*", (req, res) => {
    res.send("Error 404! not found");
});

app.delete("*", (req, res) => {
    res.send("Error 404! not found");
});

app.put("*", (req, res) => {
    res.send("Error 404! not found");
});

app.patch("*", (req, res) => {
    res.send("Error 404! not found");
});

app.listen(8080, () => {
    console.log("server is up and running on port 8080");
})