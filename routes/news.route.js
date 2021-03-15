const express = require("express");
const { postBlog, viewBlog, viewOne, viewComment, getNotifications, getBlogWithOut } = require("../controller/news.controller");
const router = express.Router();

// create new post
router.post("/post", postBlog);
router.get("/data", viewBlog);
// get post data
router.get("/post", viewOne);
router.get("/comment", viewComment);
router.get("/notifications", getNotifications)
router.get("/dataNo", getBlogWithOut)

module.exports = router