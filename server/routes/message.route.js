const express = require("express");
const { getIdRooms, listContact, sendContactRoom, setBlock } = require("../controller/message.controller");
const router = express.Router();

router.post("/getIdRoom", getIdRooms)
router.post("/contactL", listContact)
router.get("/sendContact", sendContactRoom)
router.post("/blockUser", setBlock)
module.exports = router