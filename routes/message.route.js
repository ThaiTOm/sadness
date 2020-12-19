const express = require("express");
const { getIdRooms, listContact, sendContactRoom } = require("../controller/message.controller");
const router = express.Router();

router.post("/getIdRoom", getIdRooms)
router.post("/contactL", listContact)
router.post("/sendContact", sendContactRoom)

module.exports = router