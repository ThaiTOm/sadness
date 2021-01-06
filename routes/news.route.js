const express = require("express");
const { postBlog } = require("../controller/news.controller");
const router = express.Router();


router.post("/", postBlog)
module.exports = router