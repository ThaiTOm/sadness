const { User } = require("../models/user.models");
const { Message } = require("../models/message.model");
const { cm } = require("../nodeCache");


exports.getIdRooms = (req, res) => {
    const { id } = req.body;
    return User.findById({ "_id": id }, (err, result) => {
        if (err || !result) return res.json({})
        else return res.json({ len: result.messageList.length })
    })
}

exports.listContact = (req, res) => {
    //id is idRoom
    const { id, start, end } = req.body
    User.findById(id, async (err, result) => {
        if (err || !result) {
            return res.json({
                error: "Lỗi hệ thống bạn hãy thử lại sau"
            })
        }
        else {
            const { blockN } = result || 0
            if (blockN > 3) return res.json({ message: "Bạn đã bị chặn" })
            else {
                // ru: String of all room id the user in
                let ru = await User.findById({ "_id": id }, "messageList").exec()
                ru = ru.messageList
                let arr = []
                if (ru !== null) {
                    for (let value of ru.slice(start, end)) {
                        // i is how many message user does not read
                        // a contain  users in that room
                        // value: idRoom
                        if (value) {
                            let allMessage = await Message.findById({ "_id": value }).exec()
                            let user = await cm.getMulti(allMessage.user)
                            let i = 0
                            let oldArr = allMessage.data.reverse().slice(0, 5)
                            for (let value of oldArr) {
                                if (value.seen === false && value.id !== id) i++
                                else if (value.seen === true && value.id !== id || value.id === id) break;
                            }
                            let data = {
                                user,
                                data: allMessage.data[0],
                                idRoom: allMessage._id,
                                nread: i == 5 ? "N" : i
                            }
                            arr.push(data)
                        }
                    }
                }
                return res.json(arr)
            }
        }
    })
}

// get data chat in the room
exports.sendContactRoom = async (req, res) => {
    const { id, start, end } = await req.query
    Message.findById({ "_id": id }).exec(async (err, value) => {
        if (value) {
            let data = value.data
            data = data.length > 10 ? data.slice(data.length - end, data.length - start) : data
            let users = []
            for await (value of value.user) {
                let state = await cm.get(value)
                users.push(state)
            }
            return res.json({ data, users })
        }
    })
}

exports.setBlock = async (req, res) => {
    const { idSend } = req.body
    const arr = req.body.id.split(";")
    let fnc = (user) => {
        cm.add(idSend + "blackList", user)
            .then()
            .catch(() => {
                cm.append(idSend + "blackList", user)
            })
        cm.add(user + "blackList", idSend)
            .then()
            .catch(() => {
                cm.append(user + "blackList", idSend)
            })
        User.findOneAndUpdate({ _id: user }, { $inc: { 'blockN': 1 } }).exec((err, result) => {
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
    if (arr[1] === idSend) return fnc(arr[2])
    else return fnc(arr[1])
}
exports.outMessage = async (req, res) => {
    const { id, idRoom, users } = req.body
    let fnc = (res) => {
        Message.findByIdAndDelete({ "_id": idRoom }, function (err, va) {
            if (err) return res.json({ data: "Đã có lỗi xảy ra bạn hãy thử lại sau" })
            else {
                for (let value of va.user) {
                    User.findByIdAndUpdate({ "_id": value }, { $pull: { "messageList": idRoom } }, (err, data) => {
                        if (err) return res.json({ data: "Đã có lỗi xảy ra bạn hãy thử lại sau" })
                    })
                }
                return res.json({ data: "Yêu cầu của bạn đã được thực hiện" })
            }
        })
    }
    if (users[id]) return fnc(res)
}