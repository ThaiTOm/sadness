const express = require("express");
const { createRoom, getRooms } = require("../controller/audio.controller");
const router = express.Router();

router.post("/create", createRoom)
router.get('/getRooms', getRooms)

module.exports = router