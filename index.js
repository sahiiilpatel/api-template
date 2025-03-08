const express = require("express");
const moment = require("moment");

const app = express();
const port = 1200;
const serverStart = Date.now();

app.get("/", (req, res) => {
    const now = Date.now();
    res.json({
        up: now - serverStart,
        upTime: new Date(serverStart).toLocaleString(),
        serverTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
        test: 1
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

module.exports = app;
