const { Blog } = require("../models/blog.models")
const { Idea } = require("../models/idea.models")
const date = require('date-and-time');
const { nodeCache, newCache } = require("../nodeCache");
const spawn = require("child_process").spawn;
const { generatePath, checkPath, saveRedis, deletePath } = require("../helpers/fileSetting");
const redis = require("redis");
const client = redis.createClient();
const util = require('util');
const { Shot } = require("../models/shot.models");
const CryptoJS = require("crypto-js")

exports.postBlog = async (req, res) => {
    const { text, file, id } = req.body
    const files = req.files
    let path = []
    if (files) {
        for await (let value of files) {
            let dir = await generatePath(req.body, value.originalname, value.mimetype)
            let name = "http://localhost:2704/" + id + "/news/" + dir
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
    let { id, font, color, fontSize, text, slice, time } = req.body
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

    // check if dir is exists else create 
    await checkPath(dir)

    let photoFfmpeg = async () => {
        let photoName = await generatePath(req.body, photo.originalname, photo.mimetype)
        // file in first case
        // uploads/id/shots/asdasd.mp3 //
        let fileName = `${dir}/${photoName.split(".")[0] + n}`

        let textAdd = (path) => {
            // case if user adds text 
            let type = path.split(".")[1]
            let arg = [`-i`, path, `-vf`, `drawtext=fontfile=/Font/ubuntu.ttf: \ text=${text}:fontcolor=${color}:fontsize=${fontSize * 2}:\ x=(w - text_w)/2: y=(h - text_h)/2`, `-preset`, `veryfast`, `-codec:a`, `copy`, `-max_muxing_queue_size`, `1024`, `${fileName + n}.${type}`]
            let proce = spawn(cmd, arg)
            proce.stderr.setEncoding("utf8")
            proce.stderr.on('data', function (data) {
                console.log(data);
            });
            return proce.on('close', function (err) {
                if (err !== 0) return res.json({ err: "yup" })
                if (!audio) {
                    let arg1 = [`-r`, `1/5`, `-i`, `${fileName + n}.${type}`, `-preset`, `slow`, `-c:v`, `libx264`, `-vf`, `fps=25`, `-pix_fmt`, `yuv420p`, `${fileName + n}.mp4`]
                    let process = spawn(cmd, arg1)
                    process.stderr.setEncoding("utf8")
                    process.stderr.on('data', function (data) {
                        console.log(data);
                    });
                    return process.on('close', function (error) {
                        if (error !== 0) return res.json({ err: "up" })
                        deletePath([path, `designShot/${id}/${photoName}`, `${fileName + n}.jpeg`])
                        let { err, ok } = saveRedis({
                            cmd,
                            _id: id + n,
                            idUser: id,
                            path: `${fileName + n}.mp4`,
                            time
                        })
                        if (err) return res.json({ err: "p" })
                        else return res.json({ data: "ok" })
                    })
                } else {
                    deletePath([path, `designShot/${id}/${photoName}`])
                    let { error, ok } = saveRedis({
                        cmd,
                        _id: id + n,
                        idUser: id,
                        path: `${fileName + n}.mp4`,
                        time
                    })
                    if (error) return res.json({ err: "p" })
                    else return res.json({ data: "ok" })
                }
            });
        }
        let audioAdd = () => {
            let audioName = generatePath(req.body, audio.originalname, audio.mimetype)
            let argAudio = audioName.split(".")
            let audioFile = `designShot/${id}/${argAudio[0] + n}.${argAudio[1]}`

            // splice audio
            let args1 = ['-ss', slice[0], `-i`, `designShot/${id}/${audioName}`, `-t`, slice[1] - slice[0], `-preset`, `slow`, `-c`, `copy`, audioFile]
            // audio + image
            var args2 = ['-loop', '1', '-y', `-i`, `designShot/${id}/${photoName}`, `-i`, audioFile, `-acodec`, `copy`, `-vcodec`, `mjpeg`, `-shortest`, `-preset`, `slow`, `${dir}/${photoName.split(".")[0] + n}.mp4`]

            let proc = spawn(cmd, args1);
            proc.stderr.setEncoding("utf8")
            proc.stderr.on('data', function (data) {
                console.log(data);
            });
            proc.on('close', async function (data) {
                if (data !== 0) return res.json({ err: "error" })
                else {
                    // no error
                    let process = spawn(cmd, args2);
                    process.stderr.setEncoding("utf8")
                    process.stderr.on('data', function (data) {
                        console.log(data);
                    });
                    process.on("close", (data) => {
                        deletePath([audioFile, `designShot/${id}/${audioName}`])
                        if (data !== 0) {
                            // have error
                            deletePath([audioFile])
                            return res.json({
                                status: 500,
                                err: "error"
                            })
                        }
                        else if (text) return textAdd(`${dir}/${photoName.split(".")[0] + n}.mp4`)
                        // if (audio) return
                        // case if user does not add anything
                        return deletePath([`designShot/${id}/${audioName}`, `designShot/${id}/${photoName}`])
                    })
                }
            });
        }
        let save = () => {

        }
        if (audio) return audioAdd()
        if (text) return textAdd(`designShot/${id}/${photoName}`)
        else save()
    }

    let videoFfmpeg = () => {
        // path to video when upload
        let videoName = video.path || generatePath(req.body, video.originalname, video.mimetype)
        //path to video when changing
        let fileName = `${dir}/${video.originalname.split(".")[0] + n}.mp4`

        let audioAdd = () => {
            let audioName = audio.path || generatePath(req.body, audio.originalname, audio.mimetype)
            let argAudio = [`-i`, fileName, `-i`, audioName, `-map`, `0:0`, `-map`, `1:0`, `-c:v`, `copy`, `-c:a`, `aac`, `-b:a`, `256k`, `-shortest`, `-max_muxing_queue_size`, `1024`, `${dir}/${n + video.originalname.split(".")[0]}.mp4`]
            let pro = spawn(cmd, argAudio)
            pro.stderr.setEncoding("utf8")
            pro.stderr.on('data', function (data) {
                console.log(data);
            });
            return pro.on('close', function () {
                if (!text) {
                    deletePath([fileName, audioName, videoName])

                    let { error, ok } = saveRedis({
                        _id: id + n,
                        idUser: id,
                        path: `${dir}/${n + video.originalname.split(".")[0]}.mp4`,
                        cmd,
                        time
                    })
                    if (error) return res.json({ err: "p" })
                    else return res.json({ data: "ok" })
                } else {
                    deletePath([audioName])
                    textAdd(`${dir}/${n + video.originalname.split(".")[0]}.mp4`)
                }
            });
        }

        let textAdd = (path) => {
            let arg = [`-i`, path, `-vf`, `drawtext=fontfile=/Font/ubuntu.ttf: \ text=${text}:fontcolor=${color}:fontsize=${fontSize * 2}:\ x=(w - text_w)/2: y=(h - text_h)/2`, `-preset`, `veryfast`, `-codec:a`, `copy`, `-max_muxing_queue_size`, `1024`, `${dir}/${video.originalname.split(".")[0] + n}1.mp4`]
            let proce = spawn(cmd, arg)
            proce.stderr.setEncoding("utf8")
            proce.stderr.on('data', function (data) {
                console.log(data);
            });
            proce.on('close', function () {
                deletePath([fileName, videoName, path])
                let { error, ok } = saveRedis({
                    _id: id + n,
                    idUser: id,
                    path: `${dir}/${video.originalname.split(".")[0] + n}1.mp4`,
                    cmd,
                    time
                })
                if (error) return res.json({ err: "p" })
                else return res.json({ data: "ok" })
            });
        }

        let arg = [`-i`, videoName, `-ss`, slice[0], `-t`, slice[1] - slice[0], `-preset`, `veryfast`, `-acodec`, `copy`, `-vcodec`, `copy`, fileName]
        let proc = spawn(cmd, arg);
        proc.stderr.setEncoding("utf8")
        proc.stderr.on('data', function (data) {
            console.log(data);
        });
        proc.on('close', function () {
            if (audio) return audioAdd()
            if (text) return textAdd(fileName)
            else {
                deletePath([videoName])
                return res.json({
                    message: "0k",
                    status: 200
                })
            }
        });
    }

    if (photo) return photoFfmpeg()
    if (video) return videoFfmpeg()
}
exports.getShot = async (req, res) => {
    let { start, end } = req.body
    let arr = await Shot.find().skip(start).limit(end).exec()
    let result = []
    const getAsync = util.promisify(client.hgetall).bind(client);

    for await (let value of arr) {
        let val = await getAsync(value._id)
        // set id for blog
        val["id"] = value._id
        // crypto user's id 
        const passphrase = '123nguyenduythaise1';
        val["id-user"] = CryptoJS.AES.encrypt(val["id-user"], passphrase).toString();
        result.push(val)
    }
    return res.json(result)
}