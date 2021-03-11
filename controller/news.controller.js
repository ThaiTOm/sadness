const redis = require("redis")
const client = redis.createClient()
const promisify = require("util").promisify
const { Blog } = require("../models/blog.models")
const date = require('date-and-time');
const { nodeCache, newCache } = require("../nodeCache");

// newCache save post like
// cacheNode save comment like, notifications

exports.postBlog = (req, res) => {
    const { text, file, id } = req.body
    let arr = text.split(/\r\n|\r|\n/)
    let content = {
        text: JSON.stringify(arr),
        file: JSON.stringify(file)
    }
    const blog = new Blog({
        user: id,
    })
    blog.save((err, data) => {
        if (err) {
            return res.json({
                error: "Đã xảy ra lỗi bạn hãy thử lại sau"
            })
        } else {
            let ob = {
                contentText: content.text,
                contentImg: content.file,
                comments: ""
            }
            client.hmset(data._id.toString(), ob, (err) => {
                if (err) {
                    return res.json({
                        error: "Đã xảy ra lỗi xin bạn hãy thử lại sau"
                    })
                } else {
                    return res.json({
                        message: "."
                    })
                }
            })
        }
    })
}
exports.viewBlog = async (req, res) => {
    var { start, end, id } = req.query
    start = Number(start)
    end = Number(end)
    var arrLike = newCache.get(id) || []
    var time = date.format(new Date(), 'hh:A').split(":")
    if (time[1] === "PM") {
        time = Number(time[0]) + 12
    } else {
        time = Number(time[0])
    }
    var data = []
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
        if (end > arr.length) {
            return arr.slice(Number(start), arr.length)
        } else {
            return arr.slice(Number(start), Number(end))
        }
    }

    const switchFunction = async (value) => {
        let x = 1
        switch (value) {
            case 0:
                let tenA = await getItem(time - x, time)
                return tenA
            case 1:
                let twenE = await getItem(time - x * 2, time - x)
                return twenE
            case 2:
                let thirdE = await getItem(time - x * 3, time - x * 2)
                return thirdE
            case 3:
                let fourE = await getItem(time - x * 4, time - x * 3)
                return fourE
            case 4:
                let fiveE = await getItem(time - x * 5, time - x * 4)
                return fiveE
            case 5:
                let sixE = await getItem(time - x * 6, time - x * 5)
                return sixE
            case 6:
                let sevenE = await getItem(time - x * 7, time - x * 6)
                return sevenE
            default:
                let e = await Blog.find({}, null).exec()
                e.sort((a, b) => {
                    return b.likes - a.likes
                })
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
                let promiseRedis = promisify(client.hgetall).bind(client)
                let a = await promiseRedis(idBlog)
                var comment = []
                let arr = await nodeCache.get(id) || ""
                if (arr.length === 0) {
                    arr = arr
                } else {
                    arr = arr.split(",")
                }
                for await (let value of commentTop) {
                    if (arr.indexOf(value.id) > -1) {
                        let newArr = {
                            likes: value.likes,
                            isLiked: true,
                            id: value.id,
                            value: value.value
                        }
                        comment.push(newArr)
                    } else {
                        let newArr = {
                            likes: value.likes,
                            isLiked: false,
                            id: value.id,
                            value: value.value
                        }
                        comment.push(newArr)
                    }
                }
                if (isLiked > -1) {
                    let newArr = {
                        likes: value.likes,
                        isLiked: true,
                        idBlog,
                        text: JSON.parse(a.contentText),
                        image: JSON.parse(a.contentImg),
                        comment: comment.slice(0, 3)
                    }
                    data.push(newArr)
                } else {
                    let newArr = {
                        likes: value.likes,
                        isLiked: false,
                        idBlog,
                        text: JSON.parse(a.contentText),
                        image: JSON.parse(a.contentImg),
                        comment: comment.slice(0, 3)
                    }
                    data.push(newArr)
                }
            }
            return res.json({
                data: data
            })
        } else {
            //if in last 2 hours does not have any new post then plush more to get
            if (ed > 8) {
                return res.json({
                    end: "uh"
                })
            } else {

                ret(ed + 1)
            }
        }
    }
    if (0 <= start < 10) {
        return ret(0)
    } else if (10 <= start < 20) {
        return ret(1)
    } else if (20 <= start < 30) {
        return ret(2)
    } else if (30 <= start < 40) {
        return ret(3)
    } else if (40 <= start < 50) {
        return ret(4)
    } else if (50 <= start < 60) {
        return ret(5)
    }
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
    if (arr.indexOf(id) > -1) {
        let promiseRedis = promisify(client.hgetall).bind(client)
        let a = await promiseRedis(id)
        let data = {
            isLiked: true,
            text: JSON.parse(a.contentText),
            img: JSON.parse(a.contentImg),
            likes: value.likes,
            time: hl,
            idBlog: value.id
        }
        return res.json(data)
    } else {
        let promiseRedis = promisify(client.hgetall).bind(client)
        let a = await promiseRedis(id)
        let data = {
            isLiked: false,
            text: JSON.parse(a.contentText),
            img: JSON.parse(a.contentImg),
            likes: value.likes,
            time: hl,
            idBlog: value.id
        }
        return res.json(data)
    }
}
exports.viewComment = async (req, res) => {
    const { start, id, blog } = req.query
    let commentArr = await Blog.findById({ "_id": blog }, "comment", { skip: Number(start), limit: 10 }).exec()
    console.log(commentArr)
    let likeArr = await nodeCache.get(id) || []
    let arr = []
    for await (let value of commentArr.comment) {
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
        let promiseRedis = promisify(client.hgetall).bind(client)
        let a = await promiseRedis(value.id)
        let commentTop = value.comment
        commentTop.sort((a, b) => {
            return b.likes - a.likes
        })
        let x = {
            text: JSON.parse(a.contentText),
            image: JSON.parse(a.contentImg),
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