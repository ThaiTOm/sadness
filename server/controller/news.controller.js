const { Blog } = require("../models/blog.models")
const { Idea } = require("../models/idea.models")
const date = require('date-and-time');
const { nodeCache, newCache } = require("../nodeCache");
const spawn = require("child_process").spawn;
const fs = require("fs")
const { generatePath } = require("../helpers/generatePath");
const redis = require("redis");
const client = redis.createClient();
const util = require("util")

exports.postBlog = (req, res) => {
    const { text, file, id } = req.body
    const files = req.files
    let path = []
    if (files) {
        for (let value of files) {
            let name = id + "/news/" + generatePath(req.body, value.originalname)
            path.push(name)
        }
    }
    let arr = text.split(/\r\n|\r|\n/)
    const blog = new Blog({
        user: id,
        text: arr,
        image: path
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
    let { id, font, color, fontSize, text, slice } = req.body
    let { photo, audio, video } = req.files

    audio = audio && audio[0] || null
    photo = photo && photo[0] || null
    video = video && video[0] || null

    slice = slice.split(",")
    // get time for create name of file
    let d = new Date()
    let n = d.getTime()

    // Path to ffmpeg
    var cmd = '/usr/bin/ffmpeg';
    const dir = `uploads/${id}/shots`

    const fsExists = util.promisify(fs.exists)
    const fsMkdir = util.promisify(fs.mkdir)
    try {
        let Bool = await fsExists(`./${dir}`)
        if (Bool === false) {
            await fsMkdir(`./${dir}`)
        }
    } catch (error) {
        res.json({
            status: 500,
            error: error
        })
    }
    let deletePath = (path) => {
        fs.unlink(path, (err) => {
            if (err) {
                return { error: "error" }
            }
            else {
                return { error: null }
            }
        })
    }
    if (photo) {
        let photoName = generatePath(req.body, photo.originalname, photo.mimetype)
        let audioName = generatePath(req.body, audio.originalname, audio.mimetype)
        // file in first case
        // uploads/id/shots/asdasd.mp3 //
        let fileName = `${dir}/${audioName.split(".")[0] + n}.mp3`
        //Splice the audio
        let args1 = ['-ss', slice[0], `-i`, `designShot/${id}/${audioName}`, `-t`, slice[1] - slice[0], `-c`, `copy`, fileName]
        // Audio + image from user
        var args2 = ['-loop', '1', '-y', `-i`, `designShot/${id}/${photoName}`, `-i`, fileName, `-shortest`, `-acodec`, `copy`, `-vcodec`, `mjpeg`, `${dir}/${photoName.split(".")[0] + n}.avi`]

        let proc = spawn(cmd, args1);
        proc.on('close', async function (data) {
            if (data !== 0) {
                return res.json({ error: "error" })
            } else {
                // no error
                let process = spawn(cmd, args2);
                process.on("close", (data) => {
                    // have error
                    if (data !== 0) {
                        return res.json({
                            status: 500,
                            error: "error"
                        })
                    } else if (text) {
                        // case if user adds text 
                        let arg = [`-i`, `${dir}/${photoName.split(".")[0] + n}.avi`, `-vf`, `drawtext=fontfile=/Font/ubuntu.ttf:\ text=${text}:fontcolor=${color}:fontsize=${fontSize * 3}:\ x=(w-text_w)/2: y=(h-text_h)/2`, `-codec:a`, `copy`, `${fileName + n}.mp4`]
                        let proce = spawn(cmd, arg)
                        proce.on('close', function () {
                            deletePath(`${dir}/${photoName.split(".")[0] + n}.avi`)
                            deletePath(`designShot/${id}/${photoName}`)
                            deletePath(`designShot/${id}/${audioName}`)
                            deletePath(fileName)
                            client.hmset(id + n, "id-user", id, "path", `${fileName + n}.mp4`, (err, ok) => {
                                if (err) {
                                    return res.json({
                                        status: 500,
                                        error: "error"
                                    })
                                } else {
                                    return res.json({
                                        status: 200,
                                    })
                                }
                            })
                        });
                    } else {
                        // case if user does not add anything
                        deletePath(`designShot/${id}/${photoName}`)
                        deletePath(`designShot/${id}/${audioName}`)
                        deletePath(fileName)
                    }
                })
            }
        });
    }
    else if (video) {
        let videoName = video.path || generatePath(req.body, video.originalname, video.mimetype)
        let fileName = `designShot/${id}/${n + video.originalname}`
        let arg = [`-i`, videoName, `-ss`, slice[0], `-t`, slice[1], `-acodec`, `copy`, `-vcodec`, `copy`,]
        let proc = spawn(cmd, arg);
        proc.on('close', function () {
            if (text) {
                let arg = [`-i`, fileName, `-vf`, `drawtext=fontfile=/Font/ubuntu.ttf:\ text=${text}:fontcolor=${color}:fontsize=${fontSize * 3}:\ x=(w-text_w)/2: y=(h-text_h)/2`, `-codec:a`, `copy`, `${dir}/${video.originalname.split(".")[0] + n}.mp4`]
                let proce = spawn(cmd, arg)
                proce.on('close', function () {
                    deletePath(fileName)
                    deletePath(videoName)
                    client.hmset(id + n, "id-user", id, "path", `${dir}/${video.originalname.split(".")[0] + n}.mp4`, (err, ok) => {
                        if (err) {
                            return res.json({
                                status: 500,
                                error: "error"
                            })
                        } else {
                            return res.json({
                                status: 200,
                            })
                        }
                    })
                });
            } else {

            }
        });
    }
    else {

    }
}