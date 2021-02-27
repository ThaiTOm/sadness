const { User } = require("../models/user.models");
const memcachePlus = require("memcache-plus")
const cm = new memcachePlus()


exports.getIdRooms = async (req, res) => {
    const { id } = req.body;
    const rooms = await cm.get(id)
    if (rooms !== null) {
        const arr = rooms.split(",")
        return res.json({
            len: arr.length,
        })
    }
    return res.json({
        len: 0
    })
}
exports.listContact = (req, res) => {
    //id is idRoom
    const { id } = req.body
    User.findById(id, async (err, result) => {
        if (err) {
            return res.json({
                error: "Lỗi hệ thống bạn hãy thử lại sau"
            })
        }
        else {
            const { blockN } = result;
            if (blockN > 3) {
                res.json({ message: "Bạn đã bị chặn" })
            } else {
                const { start, end } = req.query
                // ru: String of all room id the user in
                let ru = await cm.get(id)
                let arr = []
                if (ru !== null) {
                    for (let value of ru.split(",").slice(start, end)) {
                        // a contain  users in that room
                        // value: idRoom
                        if (value) {
                            let allMessage = await cm.get(value) || [","]
                            let data = [
                                allMessage[0], allMessage[1], allMessage[allMessage.length - 1], value
                            ]
                            arr.push(data)
                        }
                    }
                }
                res.json(arr)
            }
        }
    })
}

exports.sendContactRoom = async (req, res) => {
    const { id, start, end } = await req.query
    const data = await cm.get(id)
    let msg
    if (data.length - end < 0) {
        msg = await data.slice(1, data.length)
    } else {
        msg = await data.slice(data.length - end + 1, data.length)
    }

    res.json(msg)
}

exports.setBlock = async (req, res) => {
    const { idSend } = req.body
    const arr = req.body.id.split(";")
    if (arr[1] === idSend) {
        cm.add(idSend + "blackList", arr[2])
            .then()
            .catch(() => {
                cm.append(idSend + "blackList", arr[2])
            })
        cm.add(arr[2] + "blackList", idSend)
            .then()
            .catch(() => {
                cm.append(arr[2] + "blackList", idSend)
            })
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
        cm.add(idSend + "blackList", arr[1])
            .then()
            .catch(() => {
                cm.append(idSend + "blackList", arr[1])
            })
        cm.add(arr[1] + "blackList", idSend)
            .then()
            .catch(() => {
                cm.append(arr[1] + "blackList", idSend)
            })
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