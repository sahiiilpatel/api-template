const express = require("express");
const moment = require("moment");

const app = express();
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

module.exports = app; // No app.listen() needed for Vercel
