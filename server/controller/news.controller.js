const redis = require("redis")
const client = redis.createClient()
const promisify = require("util").promisify
const { Blog } = require("../models/blog.models")
const { Idea } = require("../models/idea.models")
const date = require('date-and-time');
const { nodeCache, newCache } = require("../nodeCache");
const ffmpeg = require("ffmpeg")

// newCache save post like
// cacheNode save comment like, notifications

exports.postBlog = (req, res) => {
    const { text, file, id } = req.body
    let arr = text.split(/\r\n|\r|\n/)
    const blog = new Blog({
        user: id,
        text: arr,
        image: file
    })
    blog.save((err, data) => {
        if (err) {
            return res.json({
                error: "Đã xảy ra lỗi bạn hãy thử lại sau"
            })
        } else {
            return res.json({
                message: "."
            })
        }
    })
}
exports.viewBlog = async (req, res) => {
    let { start, end, id } = req.query
    start = Number(start)
    end = Number(end)

    let arrLike = newCache.get(id) || []
    let time = date.format(new Date(), 'hh:A').split(":")

    if (time[1] === "PM") time = Number(time[0]) + 12
    else time = Number(time[0])

    let data = []

    const getItem = async (gthan, lthan) => {
        let arr = await Blog.find({ "createdAt": { $gt: gthan, $lt: lthan } }).exec()
        arr.sort((a, b) => {
            let valueA = a.likes + a.commentNumber
            let valueB = b.likes + b.commentNumber
            return valueB - valueA
        })
        if (start > arr.length) {
            return []
        }
        return end > arr.length ? arr.slice(Number(start), arr.length) : arr.slice(Number(start), Number(end))
    }
    const switchFunction = async (value) => {
        let fnc = async (start, xV, end) => {
            let tenA = await getItem(time - xV * start, time - xV * end)
            return tenA
        }
        switch (value) {
            case 0: return await fnc(1, 1, 0)
            case 1: return await fnc(2, 1, 1)
            case 2: return await fnc(3, 1, 2)
            case 3: return await fnc(4, 1, 3)
            case 4: return await fnc(5, 1, 4)
            case 5: return await fnc(6, 1, 5)
            case 6: return await fnc(7, 1, 6)
            default:
                let e = await Blog.find({}, null).exec()
                e.sort((a, b) => { return b.likes - a.likes })
                return e.slice(Number(start), Number(end))
        }
    }
    const ret = async (ed) => {
        let arr = await switchFunction(ed)
        if (arr.length > 0) {
            for await (let value of arr) {
                let idBlog = value._id.toString()
                let commentTop = value.comment
                commentTop.sort((a, b) => {
                    return b.likes - a.likes
                })
                let isLiked = arrLike.indexOf(idBlog)
                // let promiseRedis = promisify(client.hgetall).bind(client)
                // let a = await promiseRedis(idBlog)
                var comment = []
                // push data to comment array
                let fnc = (bool, value) => {
                    let newArr = {
                        likes: value.likes,
                        isLiked: bool,
                        id: value.id,
                        value: value.value
                    }
                    comment.push(newArr)
                }
                let likeFnc = (bool, value) => {
                    let newArr = {
                        likes: value.likes,
                        isLiked: bool,
                        idBlog,
                        text: value.text,
                        image: value.image,
                        comment: comment.slice(0, 3)
                    }
                    data.push(newArr)
                }
                let arr = await nodeCache.get(id) || ""
                arr.length === 0 ? arr = arr : arr = arr.split(",")
                for await (let value of commentTop) {
                    arr.indexOf(value.id) > -1 ? fnc(true, value) : fnc(false, value)
                }
                isLiked > -1 ? likeFnc(true, value) : likeFnc(false, value)
            }
            return res.json({
                data: data
            })
        } else {
            //if in last 2 hours does not have any new post then push more to get
            if (ed > 8) return res.json({ end: "uh" })
            else await ret(ed + 1)
        }
    }
    if (0 <= start < 10) return await ret(0)
    else if (10 <= start < 20) return await ret(1)
    else if (20 <= start < 30) return await ret(2)
    else if (30 <= start < 40) return await ret(3)
    else if (40 <= start < 50) return await ret(4)
    else if (50 <= start < 60) return await ret(5)

}
exports.viewOne = async (req, res) => {
    const { id, user } = req.query
    let value = await Blog.findById({ "_id": id }).exec()
    let arr = newCache.get(user) || []
    let createdAt = new Date(value.createdAt);
    let d = new Date()
    let now = d.getTime()
    // hl === how long
    let hl = now - createdAt
    hl = new Date(hl);
    hl = date.format(hl, 'DD-MM-YYYY');
    let fnc = async (bool) => {
        // let promiseRedis = promisify(client.hgetall).bind(client)
        // let a = await promiseRedis(id)
        let data = {
            isLiked: bool,
            text: value.text,
            img: value.image,
            likes: value.likes,
            time: hl,
            idBlog: value.id
        }
        return res.json(data)
    }
    arr.indexOf(id) > -1 ? await fnc(true) : await fnc(false)
}
exports.viewComment = async (req, res) => {
    const { start, id, blog, end } = req.query
    let commentArr = await Blog.findById({ "_id": blog }, "comment").exec()
    let likeArr = await nodeCache.get(id) || []
    let arr = []
    // console.log(commentArr.comment)
    for await (let value of commentArr.comment.slice(Number(start), Number(end))) {
        if (likeArr.indexOf(value.id) > -1) {
            let data = {
                id: value.id,
                likes: value.likes,
                isLiked: true,
                data: value.value
            }
            arr.push(data)
        } else {
            let data = {
                id: value.id,
                likes: value.likes,
                isLiked: false,
                data: value.value
            }
            arr.push(data)
        }
    }
    res.json({
        data: arr
    })
}
exports.getNotifications = async (req, res) => {
    const { id, start, end } = req.query
    let value = await nodeCache.get(id + "noti")
    if (value === undefined) {
        return res.json([])
    } else {
        return res.json({
            value
        })
    }
}
// get blog without id 
exports.getBlogWithOut = async (req, res) => {
    const { start, end } = req.query
    let arr = await Blog.find({}).exec()
    arr.sort(function (a, b) {
        return b.likes - a.likes
    })
    let data = []
    for await (let value of arr.slice(start, end)) {
        let createdAt = new Date(value.createdAt);
        let d = new Date()
        let now = d.getTime()
        // hl === how long
        let hl = now - createdAt
        hl = new Date(hl);
        hl = date.format(hl, 'DD-MM-YYYY');
        let commentTop = value.comment
        commentTop.sort((a, b) => {
            return b.likes - a.likes
        })
        let x = {
            text: value.text,
            image: value.image,
            likes: value.likes,
            time: hl,
            idBlog: value.id,
            comment: commentTop
        }
        data.push(x)
    }
    return res.json({
        data: data
    })
}
exports.getIdea = async (req, res) => {
    let data = await Idea.find({}).exec()
    return res.json({ data: data.reverse() })
}
exports.postShot = async (req, res) => {
    const { id, font, file, color, fontSize, text } = req.body

}