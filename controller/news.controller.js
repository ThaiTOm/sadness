const redis = require("redis")
const client = redis.createClient()
const promisify = require("util").promisify
const { Blog } = require("../models/blog.models")

exports.postBlog = (req, res) => {
    const { text, file, id } = req.body
    let content = {
        text: text.split(/\r\n|\r|\n/),
        file
    }
    const blog = new Blog({
        user: id,
        content
    })
    console.log()
    blog.save((err, data) => {
        if (err) {
            return res.json({
                error: "Đã xảy ra lỗi bạn hãy thử lại sau"
            })
        } else {
            let ob = {
                likes: "0",
                comments: ""
            }
            client.hmset(data._id.toString(), ob, (err) => {
                if (err) {
                    return res.json({
                        error: "Đã xảy ra lỗi xin bạn hãy thử lại sau"
                    })
                }
                return res.json({
                    message: "."
                })
            })


        }
    })
}