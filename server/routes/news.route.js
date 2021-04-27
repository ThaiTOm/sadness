const express = require("express");
const { postBlog, viewBlog, viewOne, viewComment, getNotifications, getBlogWithOut, postShot } = require("../controller/news.controller");
const router = express.Router();
const multer = require("multer");
const { generatePath } = require("../helpers/generatePath");
const fs = require("fs")

const fileStorageOptionNews = multer.diskStorage({
    destination: (req, file, cb) => {
        let { id } = req.body
        const dir = `./uploads/${id}/news/`
        fs.exists(dir, exist => {
            if (exist === false) return fs.mkdir(dir, { recursive: true }, err => cb(err, dir))
            return cb(null, dir)
        })
    },
    filename: (req, file, cb) => {
        let name = generatePath(req.body, file.originalname, file.mimetype)
        cb(null, name)
    }
})
const desginshotOption = multer.diskStorage({
    destination: (req, file, cb) => {
        let { id } = req.body
        const dir = `./designShot/${id}`
        fs.exists(dir, exist => {
            if (exist === false) return fs.mkdir(dir, { recursive: true }, err => cb(err, dir))
            return cb(null, dir)
        })
    },
    filename: (req, file, cb) => {
        let name = generatePath(req.body, file.originalname, file.mimetype)
        cb(null, name)
    }
})
let uploadNews = multer({ storage: fileStorageOptionNews })
let uploadShots = multer({ storage: desginshotOption })

// create new post
router.post("/post", uploadNews.array("files"), postBlog);
router.get("/data", viewBlog);
// get post data
router.get("/post", viewOne);
router.get("/comment", viewComment);
router.get("/notifications", getNotifications)
router.get("/dataNo", getBlogWithOut)
router.post("/post/shot", uploadShots.fields([{ name: "photo", maxCountL: 1 }, { name: "audio", maxCount: 1 }, { name: "video", maxCount: 1 }]), postShot)

module.exports = router