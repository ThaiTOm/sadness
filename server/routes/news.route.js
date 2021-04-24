const express = require("express");
const { postBlog, viewBlog, viewOne, viewComment, getNotifications, getBlogWithOut, postShot } = require("../controller/news.controller");
const router = express.Router();
const multer = require("multer");
const { generatePath } = require("../helpers/generatePath");
const fs = require("fs")


// const acb = require("../uploads/")
const fileStorageOption = multer.diskStorage({
    destination: (req, file, cb) => {
        let { id } = req.body
        const dir = `./uploads/${id}/news/`
        fs.exists(dir, exist => {
            if (exist === false) return fs.mkdir(dir, { recursive: true }, err => cb(err, dir))
            return cb(null, dir)
        })
    },
    filename: (req, file, cb) => {
        let name = generatePath(req.body, file.originalname)
        cb(null, name)
    }
})
var upload = multer({ storage: fileStorageOption })

// create new post
router.post("/post", upload.array("files"), postBlog);
router.get("/data", viewBlog);
// get post data
router.get("/post", viewOne);
router.get("/comment", viewComment);
router.get("/notifications", getNotifications)
router.get("/dataNo", getBlogWithOut)
router.post("/post/shot", postShot)

module.exports = router