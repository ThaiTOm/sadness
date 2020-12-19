const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const authRoute = require("./routes/indexAuth.route");
const messageRoute = require("./routes/message.route")

const promisify = require('util').promisify;
const realTimeD = require("./realtime/index");

const responseTime = require("response-time");

const redis = require("redis");

const client = redis.createClient();
const app = express();
const server = http.createServer(app);

require("dotenv").config({
    "path": "./config/config.env"
})

app.use(bodyParser.json())
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
app.use("/api/msgC/", messageRoute)
app.get("/", async (req, res) => {
    client.lrange("a", 0, -1, (err, resu) => {
        res.json(resu)
    })
})

app.use((req, res, next) => {
    res.status(404).json({
        succes: false,
        message: "Page not found"
    })
});


server.listen(2704, () => console.log("Its run in port 2704"))