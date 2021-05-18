const util = require('util');
const schedule = require('node-schedule');
const redis = require("redis");
const client = redis.createClient();
const fs = require("fs")
const spawn = require("child_process").spawn;

const { Shot } = require("../models/shot.models");


let generatePath = async (req, originalname, file) => {
    let fileArrOri = await originalname.replace(/\s/g, '').split(".")
    let mix = fileArrOri[0]
    let type = file ? file.split("/") : []
    switch (type[0]) {
        case "image":
            return mix + ".jpeg"
        case "audio":
            return mix + ".mp3"
        case "video":
            return mix + ".mp4"
        default:
            return originalname
    }
}
let checkPath = async (dir) => {
    const fsExists = util.promisify(fs.exists)
    const fsMkdir = util.promisify(fs.mkdir)

    try {
        let Bool = await fsExists(`./${dir}`)
        if (Bool === false) {
            await fsMkdir(`./${dir}`)
        }
    } catch (error) {
        return {
            error: "error"
        }
    }
}

let deletePath = (arr) => {
    for (let value of arr) {
        fs.unlink(value, (err) => {
            if (err) {
                return { error: "error" }
            }
            else {
                return { error: null }
            }
        })
    }
}

let saveRedis = ({ cmd, _id, idUser, path, time }) => {
    // get image from video to set background
    let bgPath = path.split(".")
    // splice "mp4" in path
    bgPath.splice(bgPath.length - 1, 1)
    let arg = [`-ss`, "00:00:00", `-i`, path, `-vframes`, `1`, `${bgPath[0]}bg.jpeg`]

    // run task 
    let proce = spawn(cmd, arg)
    proce.stderr.setEncoding("utf8")
    proce.stderr.on('data', function (data) {
        console.log(data);
    });

    return proce.on('close', function (err) {
        let paths = path.split("/")
        paths.splice(0, 1)
        paths = paths.join("/")
        bgPath = bgPath[0].split("/")

        bgPath.splice(0, 1)
        bgPath = bgPath.join("/")

        let date = new Date()
        let current = date.getTime()

        // 1 hour
        let d = new Date(current + (time * 60 * 1000 * 60))
        schedule.scheduleJob(d, function () {
            client.del(_id, (err, ok) => {
                if (!err) {
                    deletePath([paths])
                    Shot.findByIdAndRemove({ "_id": _id }).exec()
                }
            })
        });
        client.hmset(_id,
            "id-user", idUser,
            "path", "http://localhost:2704/" + paths,
            "b-g", "http://localhost:2704/" + `${bgPath}bg.jpeg`, (err, ok) => {
                if (err) return { error: "error" }
                else {
                    let data = new Shot({ _id })
                    data.save((err, succes) => {
                        if (err) console.log(err)
                    })
                    return {
                        error: "none",
                        succes: "ok"
                    }
                }
            })
    })
}

module.exports = { generatePath, checkPath, deletePath, saveRedis }