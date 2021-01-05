const redis = require("redis");
const clientRedis = redis.createClient();
const promisify = require('util').promisify;
const { User } = require("../models/user.models");

exports.getIdRooms = (req, res) => {
    const { id } = req.body;
    clientRedis.llen(id, (err, result) => {
        if (err) {
            return res.json({
                error: "Something went wrong, Please try again"
            })
        } else {
            clientRedis.lrange(id, 0, -1, (err, idRooms) => {
                if (err) {
                    return res.json({
                        error: "Something went wrong, Please try again"
                    })
                } else {
                    return res.json({
                        len: result,
                        idRooms: idRooms
                    })
                }
            })
        }
    })
}
exports.listContact = (req, res) => {
    console.log("run")
    //id is idRoom
    const { id } = req.body
    User.findById(id, async (err, result) => {
        if (err) {
            console.log(err)
        }
        else {
            const { blockN } = result;
            if (blockN > 3) {
                res.json({ message: "Ban da bi block" })
            } else {
                const { start, end } = req.query
                let getLast = promisify(clientRedis.lrange).bind(clientRedis)
                let alrange = promisify(clientRedis.lrange).bind(clientRedis)
                const rang = await alrange(id, start, end)
                let arr = []
                for (let value of rang) {
                    let a = await getLast(value, -2, -1)
                    let b = await getLast(value, 0, 0)
                    await a.push(b.join(""), value)
                    arr.push(a)
                }
                res.json(arr)
            }
        }
    })
}

exports.sendContactRoom = async (req, res) => {
    const { id, start, end } = req.query
    let lenMsg = promisify(clientRedis.llen).bind(clientRedis)
    // sfl === start from list
    // let sfl = await lenMsg(id) - start
    let getMsg = promisify(clientRedis.lrange).bind(clientRedis)
    const msg = await getMsg(id, start, end)
    res.json(msg)
}

exports.setBlock = async (req, res) => {
    // const u1 = req.userBlock;
    // const u2 = req.userBBlock
    const { idSend } = req.body
    const arr = req.body.id.split(";")
    console.log(arr[2], arr[1])
    //check 2 id send from client what is id want to block another
    if (arr[1] === idSend) {
        clientRedis.lpush(idSend + "blackList", arr[2])
        clientRedis.lpush(arr[2] + "blackList", idSend)
        User.findOneAndUpdate({ _id: arr[2] }, { $inc: { 'blockN': 1 } }).exec((err, result) => {
            if (err) {
                return res.json({
                    error: "Đã có lỗi xảy ra bạn vui lòng thử lại"
                })
            } else {
                return res.json({
                    message: "."
                })
            }
        })
    } else {
        clientRedis.lpush(idSend + "blackList", arr[1])
        clientRedis.lpush(arr[1] + "blackList", idSend)
        User.findOneAndUpdate({ _id: arr[1] }, { $inc: { 'blockN': 1 } }).exec((err, result) => {
            if (err) {
                return res.json({
                    error: "Đã có lỗi xảy ra bạn vui lòng thử lại"
                })
            } else {
                return res.json({
                    message: "."
                })
            }
        })
    }

}