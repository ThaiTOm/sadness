const express = require("express");
const { postBlog, viewBlog, viewOne, viewComment } = require("../controller/news.controller");
const router = express.Router();

router.post("/post", postBlog);
router.get("/data", viewBlog);
router.get("/post", viewOne);
router.get("/comment", viewComment);

module.exports = router