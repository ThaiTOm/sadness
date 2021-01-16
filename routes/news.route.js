const express = require("express");
const { postBlog, viewBlog, likeBlog } = require("../controller/news.controller");
const router = express.Router();

router.post("/post", postBlog);
router.get("/data", viewBlog);
router.post("/like", likeBlog)
module.exports = router