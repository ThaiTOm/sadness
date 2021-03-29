const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const authRoute = require("./routes/indexAuth.route");
const messageRoute = require("./routes/message.route")
const realTimeD = require("./realtime/index");
const newsRoute = require("./routes/news.route")
const memcachePlus = require("memcache-plus")
const cm = new memcachePlus()
// var cache = require('memory-cache');
// var newCache = new cache.Cache();
const responseTime = require("response-time");

// const { User } = require("./models/user.models");
const app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
const server = http.createServer(app);

require("dotenv").config({
    "path": "./config/config.env"
})

app.use(bodyParser.json({ limit: "100mb" }))
app.use(cors())
app.use(responseTime());
app.use("/peerjs", ExpressPeerServer(server))
connectDB()

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "OPTIONS"],
        credentials: true
    }
});

// connect real time
io.on('connection', (socket) => realTimeD.index(io, socket));

app.use("/api/", authRoute);
app.use("/api/msgC/", messageRoute);
app.use("/api/news/", newsRoute);
app.get("/", (req, res) => {
    let now = Date.now()
    cm.flush()
    return res.json(now - 3600000)
})
app.use((req, res, next) => {
    res.status(404).json({
        succes: false,
        message: "Page not found"
    })
});


server.listen(2704, () => console.log("Its run in port 2704"))
