const express = require("express");
const { postBlog, viewBlog } = require("../controller/news.controller");
const router = express.Router();

router.post("/post", postBlog);
router.get("/data", viewBlog);
module.exports = router