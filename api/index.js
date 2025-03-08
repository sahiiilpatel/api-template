const express = require("express");
const moment = require("moment");

const app = express();
const port = 1200;  // Use any port
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

// Only listen when running locally
if (process.env.NODE_ENV !== "production") {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

module.exports = app;
