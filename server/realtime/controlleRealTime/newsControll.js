const { Blog } = require("../../models/blog.models")
const { User } = require("../../models/user.models")
const { nodeCache, newCache } = require("../../nodeCache");

// newCache save post like
// cacheNode save comment like, notifications

var saveCacheNode = async ({ user, type, link, id }) => {
    console.log(user)
    // user: that upload the blog, id:id blog
    let arr = nodeCache.get(user + "noti") || []
    let i = 0
    for await (let a of arr) {
        if (a.type === type && a.value === link && a.id === id) {
            let ob = {
                id,
                type: type,
                value: link,
                seen: false,
                number: a.number + 1
            }
            let old = [...arr]
            old.splice(i, 1)
            old.unshift(ob)
            nodeCache.set(user + "noti", old, 2147483647)
            return { number: ob.number }
        }
        i += 1
    }
    let ob = {
        id,
        type: type,
        value: link,
        seen: false,
        number: 1
    }
    arr.unshift(ob)
    nodeCache.set(user + "noti", arr, 2147483647)
    return { number: ob.number }
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
        await Blog.findByIdAndUpdate({ _id: idRecieve }, { $push: { "comment": data }, $inc: { "commentNumber": 1 } })
        let { number } = await saveCacheNode({ user: user.user, type: " người đã bình luận về bài viết của bạn", link: "posts/id=" + idRecieve, id: data.id })
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
        User.findOneAndUpdate({ _id: id }, { $push: { "likes": value } }).exec()
        if (a.user === id) {
            return {
                error: "",
                message: "ok"
            }
        }
        // save to cache for the notifications
        let { number } = await saveCacheNode({ user: a.user, type: " người đã thích bài viết của bạn", link: "posts/id=" + value, id: value })
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
        // if it already exists
        if (index > -1) {
            old.splice(index, 1)
            newCache.put(id, old)
            Blog.findOneAndUpdate({ _id: value }, { $inc: { "likes": -1 } }).exec()
            User.updateOne({ _id: id }, { $pull: { "likes": value } }).exec()
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
    let idCommentArr = idComment.split(";")
    let user = await Blog.findById({ _id: value }).exec()
    let cacheData = await nodeCache.get(id) || ""
    let incData = async (data) => {
        data === undefined && nodeCache.set(id, idComment, 2147483647) || nodeCache.set(id, data + "," + idComment, 2147483647)
        await Blog.updateOne({ "_id": value, "comment.id": idComment }, { $inc: { "comment.$.likes": 1 } }).exec()
        if (idCommentArr[0] === id) return { message: "ok" }
        let { number } = await saveCacheNode({ user: idCommentArr[0], type: " người đã thích bình luận của bạn", link: "posts/id=" + value, id: idComment })
        // save user likes
        return {
            message: "ok",
            user: idCommentArr[0],
            type: "posts/id=" + value,
            number
        }
    }
    if (cacheData === undefined || cacheData.length === 0 || cacheData === null) return incData()
    else {
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
        } else return incData(cacheData)
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