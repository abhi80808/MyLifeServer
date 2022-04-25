const express = require('express');
const app = express();

app.get("*", (req, res) => {
    res.send("this is the primary route");
})

app.listen(8080, () => {
    console.log("server is up and running");
})