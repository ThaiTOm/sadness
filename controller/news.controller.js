const redis = require("redis")
const client = redis.createClient()
const promisify = require("util").promisify
const { Blog } = require("../models/blog.models")

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
                    console.log(err)
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
    const { start, end } = req.query
    // arr is contain from most likes to later likes
    const arr = await Blog.find({}, null, { skip: Number(start), limit: Number(end) }).exec()
    let data = []
    for await (let value of arr) {
        let id = value._id.toString()
        let promiseRedis = promisify(client.hgetall).bind(client)
        let a = await promiseRedis(id)
        let newArr = {
            text: JSON.parse(a.contentText),
            image: JSON.parse(a.contentImg)
        }
        data.push(newArr)
    }
    console.log(data.length)
    return res.json({
        data: data
    })
}