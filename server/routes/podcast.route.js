const express = require("express");
const { createRoom, getRooms } = require("../controller/podcast.controller");
const router = express.Router();

router.post("/create", createRoom)
router.get('/getRooms', getRooms)

module.exports = router