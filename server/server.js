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
const schedule = require('node-schedule');
const redis = require("redis")
const client = redis.createClient()

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
// 
app.use("/api/", authRoute);
app.use("/api/msgC/", messageRoute);
app.use("/api/news/", newsRoute);
// app.get("/", (req, res) => {
//     var task = cron.schedule('1 * * * *', () => {
//         console.log('stopped task');
//     }, {
//         scheduled: false
//     });
//     task.start();
// })

// const job = schedule.scheduleJob("0 */1 * * * ", function () {
//     console.log('Time for tea!');
// });

app.get("/", (req, res) => {
    client.scan("0", (err, data) => {
        if (err) {
            return res.json(err)
        } else {
            return res.json(data)
        }
    })
})
app.use((req, res, next) => {
    res.status(404).json({
        succes: false,
        message: "Page not found"
    })
});


server.listen(2704, () => console.log("Its run in port 2704"))
