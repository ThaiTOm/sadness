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


const responseTime = require("response-time");

const redis = require("redis");
// const { User } = require("./models/user.models");

const client = redis.createClient();
const app = express();
const server = http.createServer(app);

require("dotenv").config({
    "path": "./config/config.env"
})

app.use(bodyParser.json({ limit: "100mb" }))
app.use(cors())
app.use(responseTime());
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
app.get("/", async(req, res) => {
    // let message = ["1", "2", "3", "4"]
    // let ob = {
    //     message: message,
    //     user1: "thai",
    //     user2: "duy"
    // }
    // // cm.add("key", "ob,ob2")
    // //     .then()
    // //     .catch(() => {
    // //         cm.append("key", "ob, 1 , ")
    // //     })
    // let arr = await cm.get("key")
    // res.json(arr)
    // const room = await cm.get("5ff701b3c1d1100f2de9940b0")
    // res.json(room)
    const arr = [1]
    // cm.add("key",arr)
    //   .then((err)=>{
    //       res.json(err)
    //   })
   const a = await cm.get("5ff701b3c1d1100f2de9940b2")
   res.json(a)
    // cm.flush()
})
app.get("/delete",(req,res)=>{
    cm.flush()
    res.json("ok")
})

app.use((req, res, next) => {
    res.status(404).json({
        succes: false,
        message: "Page not found"
    })
});


server.listen(2704, () => console.log("Its run in port 2704"))
