const { Blog } = require("../../models/blog.models")
const { User } = require("../../models/user.models")
const { nodeCache, newCache } = require("../../nodeCache");

// newCache save post like
// cacheNode save comment like, notifications

var saveCacheNode = (user, type, link) => {
    let arr = nodeCache.get(user + "noti") || []
    const ob = {
        type: type,
        value: link,
        seen: false
    }
    arr.push(ob)
    nodeCache.set(user + "noti", arr, 2147483647)
}
const comment = async ({ idRecieve, idSent, value }) => {
    let x = await Blog.findById({ "_id": idRecieve }, "comment").exec()
    let length = x.comment.length || 0
    let text = value.split(/\r\n|\r|\n/)
    const data = {
        id: idSent + ";" + length + ";" + idRecieve,
        value: text,
        likes: 0
    }
    let user = await Blog.findById({ "_id": idRecieve }, "user").exec()
    if (user.user === idSent) {
        await Blog.findByIdAndUpdate({ _id: idRecieve }, { $push: { "comment": data }, $inc: { "commentNumber": 1 } }).exec()
        return {
            ok: "ok"
        }
    } else {
        await Blog.findByIdAndUpdate({ _id: idRecieve }, { $push: { "comment": data }, $inc: { "commentNumber": 1 } }, async (err, data) => {
            if (err) {
                return {
                    error: "error",
                }
            }
        })
        saveCacheNode(user.user, "comment", "posts/id=" + idRecieve)
        return {
            user
        }
    }
}


const likeBlog = async ({ id, value }) => {
    // id is id of the user, value is the id of blog
    // increment likes in mongodb
    let incData = async () => {
        let a = await Blog.findOneAndUpdate({ _id: value }, { $inc: { "likes": 1 } }).exec()
        await User.findOneAndUpdate({ _id: id }, { $push: { "likes": value } }).exec()
        if (a.user === id) {
            return {
                error: "",
                message: "ok"
            }
        }
        // save to cache for the notifications
        saveCacheNode(a.user, "likeBlog", "posts/id=" + value)
        return {
            error: "",
            message: "ok",
            user: a.user
        }
    }
    let cacheData = newCache.get(id)
    if (cacheData === null) {
        newCache.put(id, [value], 2147483647)
        return incData()
    } else {
        let old = [...cacheData]
        let index = old.indexOf(value)
        if (index > -1) {
            old.splice(index, 1)
            newCache.put(id, old)
            await Blog.findOneAndUpdate({ _id: value }, { $inc: { "likes": -1 } }).exec()
            await User.updateOne({ _id: id }, { $pull: { "likes": value } }).exec()
            return {
                error: "error",
                message: ""
            }
        } else {
            old.push(value)
            newCache.put(id, old)
            return incData()
        }
    }
}
const likeCmt = async ({ value, id, idComment }) => {
    // value contain id of post comment, id is id of user
    let a = idComment.split(";")
    let incData = async (data) => {
        if (data === undefined) {
            await Blog.updateOne({ "_id": value, "comment.id": idComment }, { $inc: { "comment.$.likes": 1 } }).exec()
            let err = nodeCache.set(id, idComment, 2147483647)
            if (a[0] === id) {
                return {
                    error: err,
                    message: "ok"
                }
            }
            saveCacheNode(a[0], "likeCmt", "posts/id=" + value)
            return {
                error: err,
                message: "ok",
                user: a[0]
            }
        } else {
            await Blog.updateOne({ "_id": value, "comment.id": idComment }, { $inc: { "comment.$.likes": 1 } }).exec()
            let arr = data
            arr = arr + "," + idComment
            let err = nodeCache.set(id, arr, 2147483647)
            if (a[0] === id) {
                return {
                    error: err,
                    message: "ok"
                }
            }
            saveCacheNode(a[0], "likeCmt", "posts/id=" + value)
            return {
                error: err,
                message: "ok",
                user: a[0]
            }
        }
    }
    let cacheData = await nodeCache.get(id) || ""
    if (cacheData === undefined || cacheData.length === 0) {
        return incData()
    } else {
        let arr = cacheData.split(",")
        let index = arr.indexOf(idComment)
        if (index > -1) {
            await Blog.updateOne({ "_id": value, "comment.id": idComment }, { $inc: { "comment.$.likes": -1 } }).exec()
            let old = [...arr]
            old.splice(index, 1)
            nodeCache.set(id, old)
            return {
                error: "",
                message: "exists"
            }
        } else {
            return incData(cacheData)
        }
    }
}
module.exports = { comment, likeBlog, likeCmt };