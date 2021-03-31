const { Blog } = require("../../models/blog.models")
const { User } = require("../../models/user.models")
const { nodeCache, newCache } = require("../../nodeCache");

// newCache save post like
// cacheNode save comment like, notifications

var saveCacheNode = async (user, type, link, id) => {
    let arr = nodeCache.get(user + "noti") || []
    let ob
    let i = 0
    for await (let a of arr) {
        if (a.type === type && a.value === link && a.id === id) {
            ob = {
                id,
                type: type,
                value: link,
                seen: false,
                number: a.number
            }
            let old = [...arr]
            old.splice(i, 1)
            old.unshift(ob)
            nodeCache.set(user + "noti", old, 2147483647)
            return {
                number: ob.number
            }
        } else {
            ob = {
                id,
                type: type,
                value: link,
                seen: false,
                number: a.number + 1
            }
            arr.unshift(ob)
            nodeCache.set(user + "noti", arr, 2147483647)
            return {
                number: ob.number
            }
        }
    }
    ob = {
        id,
        type: type,
        value: link,
        seen: false,
        number: 1
    }
    arr.unshift(ob)
    nodeCache.set(user + "noti", arr, 2147483647)
    return {
        number: ob.number
    }
}
const comment = async ({ idRecieve, idSent, value }) => {
    let x = await Blog.findById({ "_id": idRecieve }, "comment").exec()
    let length = x.comment.length || 0
    let text = value.split(/\r\n|\r|\n/)
    console.log(text)
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
        await Blog.findByIdAndUpdate({ _id: idRecieve }, { $push: { "comment": data }, $inc: { "commentNumber": 1 } })
        let { number } = await saveCacheNode(user.user, " người đã bình luận về bài viết của bạn", "posts/id=" + idRecieve, data.id)
        return {
            user,
            type: "post/id=" + idRecieve,
            number
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
        let { number } = await saveCacheNode(a.user, " người đã thích bài viết của bạn", "posts/id=" + value, value)
        return {
            error: "",
            message: "ok",
            user: a.user,
            type: "posts/id=" + value,
            number
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
    var user = await Blog.findById({ _id: value }).exec()
    let incData = async (data) => {
        if (data === undefined) {
            await Blog.updateOne({ "_id": value, "comment.id": idComment }, { $inc: { "comment.$.likes": 1 } }).exec()
            let err = nodeCache.set(id, idComment, 2147483647)
            if (a[0] === user.user) {
                return {
                    error: err,
                    message: "ok"
                }
            }
            let { number } = await saveCacheNode(user.user, " người đã thích bình luận của bạn", "posts/id=" + value, idComment)
            return {
                error: err,
                message: "ok",
                user: user.user,
                type: "posts/id=" + value,
                number
            }
        } else {
            await Blog.updateOne({ "_id": value, "comment.id": idComment }, { $inc: { "comment.$.likes": 1 } }).exec()
            let arr = data
            arr = arr + "," + idComment
            let err = nodeCache.set(id, arr, 2147483647)
            if (user.user === id) {
                return {
                    error: err,
                    message: "ok"
                }
            }
            let { number } = await saveCacheNode(user.user, " người đã thích bình luận của bạn", "posts/id=" + value, idComment)
            return {
                error: err,
                message: "ok",
                user: user.user,
                type: "posts/id=" + value,
                number
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
            old = old.join(",")
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
const setOffline = ({ id }) => {
    var d = new Date()
    var now = d.getTime()
    User.findByIdAndUpdate({ "_id": id }, { "lastOffline": now, "isOnline": false }).exec()
}
const setOnline = ({ id }) => {
    User.findByIdAndUpdate({ "_id": id }, { "isOnline": true }).exec()
}
module.exports = { comment, likeBlog, likeCmt, setOffline, setOnline };