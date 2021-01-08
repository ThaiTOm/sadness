const express = require("express");
const { postBlog } = require("../controller/news.controller");
const router = express.Router();

router.post("/post", postBlog);

module.exports = router