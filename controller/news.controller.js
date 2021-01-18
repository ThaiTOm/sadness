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
    let { start, end, id } = req.query
    let arrLike = newCache.get(id) || []
    let time = Date.now()
    let data = []

    const getItem = async (gthan, lthan) => {
        let arr = await Blog.find({ "createdAt": { $gt: gthan, $lt: lthan } }).exec()
        arr.sort((a, b) => {
            return b.likes - a.likes
        })
        return arr.slice(Number(start), Number(end))
    }

    const switchFunction = async (value) => {
        switch (value) {
            case "0":
                let tenA = await getItem(time - 3600000, time)
                return tenA
            case "1":
                let twenE = await getItem(time - 3600000 * 2, time - 3600000)
                return twenE
            case "2":
                let thirdE = await getItem(time - 3600000 * 3, time - 3600000 * 2)
                return thirdE
            case "3":
                let fourE = await getItem(time - 3600000 * 4, time - 3600000 * 3)
                return fourE
            case "4":
                let fiveE = await getItem(time - 3600000 * 5, time - 3600000 * 4)
                return fiveE
            case "5":
                let sixE = await getItem(time - 3600000 * 6, time - 3600000 * 5)
                return sixE
            case "6":
                let sevenE = await getItem(time - 3600000 * 7, time - 3600000 * 6)
                return sevenE
            default:

                let e = await Blog.find({}, null, { skip: Number(start), limit: Number(end) }).exec()
                return e
        }
    }
    let arr = []
    for (let i = 0; i < 8; i++) {
        let wait = await switchFunction(i.toString())
        if (wait.length > 0) {
            arr = arr.concat(wait)
            for await (let value of arr) {
                let idBlog = value._id.toString()
                let isLiked = arrLike.indexOf(idBlog)
                let promiseRedis = promisify(client.hgetall).bind(client)
                let a = await promiseRedis(idBlog)
                if (isLiked > -1) {
                    let newArr = {
                        likes: value.likes,
                        isLiked: true,
                        idBlog,
                        text: JSON.parse(a.contentText),
                        image: JSON.parse(a.contentImg)
                    }
                    data.push(newArr)
                } else {
                    let newArr = {
                        likes: value.likes,
                        isLiked: false,
                        idBlog,
                        text: JSON.parse(a.contentText),
                        image: JSON.parse(a.contentImg)
                    }
                    data.push(newArr)
                }
            }
            return res.json({
                data: data
            })

        }
    }
}

exports.likeBlog = (req, res) => {
    // id is id of the user, value is the id of blog
    const { id, value } = req.body
    // increment likes in mongodb
    let incData = () => {
        Blog.findOneAndUpdate({ _id: value }, { $inc: { "likes": 1 } }).exec((err, result) => {
            if (err) {
                return res.json({
                    error: "Some thing went wrong, please try again"
                })
            } else {
                User.updateOne({ _id: id }, { $push: { "likes": value } }, (err, data) => {
                    if (err) {
                        return res.json({
                            error: "Some thing went wrong, please try again"
                        })
                    } else {
                        return 0
                    }
                })
            }
        })
    }
    let cacheData = newCache.get(id)
    if (cacheData === null) {
        newCache.put(id, [value], 31104000)
        incData()
    } else {
        let old = [...cacheData]
        let index = old.indexOf(value)
        if (index > -1) {
            old.splice(index, 1)
            newCache.put(id, old)
            Blog.findOneAndUpdate({ _id: value }, { $inc: { "likes": -1 } }).exec((err, result) => {
                if (err) {
                    return res.json({
                        error: "Some thing went wrong, please try again"
                    })
                } else {
                    User.updateOne({ _id: id }, { $push: { "likes": value } }, (err, data) => {
                        if (err) {
                            return res.json({
                                error: "Some thing went wrong, please try again"
                            })
                        } else {
                            return 0
                        }
                    })
                }
            })
        } else {
            old.push(value)
            newCache.put(id, old)
            incData()
        }


    }

}