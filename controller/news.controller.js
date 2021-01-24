const redis = require("redis")
const client = redis.createClient()
const promisify = require("util").promisify
const { Blog } = require("../models/blog.models")
const { User } = require("../models/user.models")
const date = require('date-and-time');
var cache = require('memory-cache');
var newCache = new cache.Cache();


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
                commentTop = commentTop.slice(0, 3)
                let isLiked = arrLike.indexOf(idBlog)
                let promiseRedis = promisify(client.hgetall).bind(client)
                let a = await promiseRedis(idBlog)
                if (isLiked > -1) {
                    // commentTop.map(function(a){
                    //     cacheDisk.has
                    // })
                    let newArr = {
                        likes: value.likes,
                        isLiked: true,
                        idBlog,
                        text: JSON.parse(a.contentText),
                        image: JSON.parse(a.contentImg),
                        comment: commentTop
                    }
                    data.push(newArr)
                } else {
                    let newArr = {
                        likes: value.likes,
                        isLiked: false,
                        idBlog,
                        text: JSON.parse(a.contentText),
                        image: JSON.parse(a.contentImg),
                        comment: commentTop
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
