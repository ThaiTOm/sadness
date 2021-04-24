const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const authRoute = require("./routes/indexAuth.route");
const messageRoute = require("./routes/message.route")
const realTimeD = require("./realtime/index");
const newsRoute = require("./routes/news.route")
const responseTime = require("response-time");
const fs = require("fs")

const app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
const { Message } = require("./models/message.model");
const { User } = require("./models/user.models");
const server = http.createServer(app);

require("dotenv").config({
    "path": "./config/config.env"
})

app.use(bodyParser.json({ limit: "100mb" }))
app.use(cors())
app.use(responseTime());
app.use(express.static("./uploads"));
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

app.get("/", (req, res) => {
    let data = new Buffer.from([91, 111, 98, 106, 101, 99, 116, 32, 65, 114, 114, 97, 121, 66, 117, 102, 102, 101, 114, 93])
    fs.writeFile("./uploads/d.png", data, "binary", function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log("data")
        }
    })
})
app.use("/api/", authRoute);
app.use("/api/msgC/", messageRoute);
app.use("/api/news/", newsRoute);
app.get("/load/:num", (req, res) => {
    const { num } = req.params
    let arr = []
    for (i = 0; i < parseInt(num); i++) {
        Message.findByIdAndUpdate({ "_id": "6067dad2cdcc3315c25f12ee0a" }, { $push: { "data": "asd" } }, (err, result) => {
            User.findById({ "_id": "6067dad2cdcc3315c25f12ee" }, (err, resuo) => {

            })
        })
    }

    return res.json(arr)
})
app.use((req, res, next) => {
    res.status(404).json({
        succes: false,
        message: "Page not found"
    })
});


server.listen(2704, () => console.log("Its run in port 2704"))
