const { arrOfRegion, regionGroup } = require("../../helpers/region");

const { cutSpaceInString } = require("../../../a-client/src/helpers/main/algorithm");
const { cm } = require("../../nodeCache");
const { Message } = require("../../models/message.model");
const { User } = require("../../models/user.models");
const { generatePath } = require("../../helpers/fileSetting");
const fs = require("fs");
const { decryptWithAES } = require("../../helpers/message");


const addUser = async ({ id, ipOfUser, len }) => {
    // First check in messageSave already have this user or not
    ipOfUser = cutSpaceInString(ipOfUser);
    for (let i = 0; i < arrOfRegion[ipOfUser].length; i++) {
        if (arrOfRegion[ipOfUser][i].room === id + len) {
            arrOfRegion[ipOfUser].splice(i, i + 1)
            return { have: "have" }
        }
    }
    // Create new variable that handle name and room of someone
    const user = { id: id, room: id + len }

    const createRoom = async (arrOfRegion, a, pos) => {
        let fnc = (value, roomId) => {
            User.findByIdAndUpdate({ "_id": value }, { $push: { "messageList": { "$each": [roomId], "$position": 0 } } }, (err, succes) => {
                if (err) console.log(err)
            })
        }
        let name1 = a[0].id
        let name2 = a[1].id
        let roomChatId = a[0].room + "a"
        // we get first id in the room and set that id to id room
        // get 2 items first in the array
        arrOfRegion[pos].splice(0, 2)
        // First we need to add Room Id to their account to find faster
        fnc(name1, roomChatId)
        fnc(name2, roomChatId)
        // then move it to message database
        const obj = new Message({
            _id: roomChatId,
            user: [name1, name2],
            data: []
        })
        obj.save((err, succes) => {
            if (err) console.log(err)
        })
        // client.expire(roomChatId, 36600)
        return { idRoom: roomChatId }
    }

    // If user of this region have more than 0 then push new user in
    const userInIp = async (arrOfRegion, ipOfUser) => {
        arrOfRegion[ipOfUser].push(user);
        // If that region has more than 1 people than we get that out
        if (arrOfRegion[ipOfUser].length >= 2) {
            // Use logic here
            let a = arrOfRegion[ipOfUser].slice(0, 2);
            // Check if 2 people here not block each other
            let arr = await cm.get(a[0].id + "blackList")
            //check if that one is not from the list
            let arg = [a[0], a[1]]
            if (arr === null) {
                return createRoom(arrOfRegion, arg, ipOfUser)
            } else if (arr.includes(a[1].id) === false) {
                //pass data to createRoom function and return that
                return createRoom(arrOfRegion, arg, ipOfUser)
            }
            return { idRoom: user.room + "a", yet: "yet" }
        }
        return { idRoom: user.room + "a" }
    }

    const userInDif = async (arrOfRegion, i, user) => {
        // If user of this region have more than 0 then push new user in
        arrOfRegion[i].push(user);
        // If that region has more than 1 people than we get that out
        if (arrOfRegion[i].length >= 2 && arrOfRegion[i][0].id !== arrOfRegion[i][1].id) {
            // Use logic here
            let a = arrOfRegion[i];
            // Check if 2 people here not block each other
            let arr = await cm.get(a[0].id + "blackList")
            for (let x = 1; x < a.length; x++) {
                //check if that one is not from the list
                let arg = [a[0], a[x]]
                if (arr === null) return createRoom(arg, x)
                else if (arr.includes(a[x].id) === false) return createRoom(arg, x)
            }
            return { idRoom: user.room + "a", yet: "yet" }
        }
        return { idRoom: user.room + "a", yet: "yet" }
    }
    // Wait of check when user if join to some room
    // Run until the user find partner
    for (let i in arrOfRegion) {
        // Find if have anyone in that state(IP) has alone join to this
        if (arrOfRegion[ipOfUser].length > 0) {
            // in the same local
            return userInIp(arrOfRegion, ipOfUser)
        }
        else if (arrOfRegion[i].length > 0) {
            // in different
            return userInDif(arrOfRegion, i, user)
        }
    }
    // If no one is waiting than 
    arrOfRegion[ipOfUser].push(user)
    return { idRoom: user.room + "a", yet: "yet" };
}

const sendMessage = ({ room, message, id, type }) => {
    //mess contain message and id 
    let date = new Date()
    date = date.getTime()
    let mess = {
        data: [message],
        seen: false,
        idRoom: room,
        type: type,
        id: id,
        date: Math.ceil(date)
    }
    setTimeout(async () => {
        let messageUsers = await Message.findByIdAndUpdate({ "_id": room }, { $push: { "data": mess } }).exec()
        for await (value of messageUsers.user) {
            let data = await User.findById({ "_id": value }, { "messageList": 1 }).exec()
            let arr = [...data.messageList]
            // find index of the that room in array
            let index = arr.indexOf(room)
            arr.splice(index, 1)
            arr.unshift(room)
            User.findByIdAndUpdate({ "_id": value }, { $set: { "messageList": arr } }).exec()
        }
    }, 1000)
    return { roomMessage: room, messageMessage: mess, memberMessage: id }
}

const seenMessage = async ({ id, userId }) => {
    let fnc = (getM) => {
        if (getM[getM.length - 1].seen === false && getM[getM.length - 1].id !== userId) {
            let old = [...getM]
            old[old.length - 1].seen = true
            Message.findByIdAndUpdate({ "_id": id }, { $set: { "data": old } }).exec()
        }
    }
    // get message
    let getM = await Message.findById({ "_id": id }).exec()
    getM && getM.data.length > 0 && fnc(getM.data)
}

const chatGorup = ({ id, len, ipOfUser }) => {
    ipOfUser = cutSpaceInString(ipOfUser);
    for (let i = 0; i < regionGroup[ipOfUser].length; i++) {
        if (regionGroup[ipOfUser][i].room === id + len + "g") {
            regionGroup[ipOfUser].splice(i, i + 1)
            return { have: "have" }
        }
    }
    const spliceUser = (start, end, pos) => {
        let data
        for (let i = start; i < end; i++) {
            data = regionGroup[pos][i]
            for (let value of regionGroup[pos].slice(start - i, end)) {
                if (data === value) {
                    let temp = regionGroup[pos].splice(i, 1)
                    regionGroup[pos].push(temp)
                }
            }
        }
        regionGroup[pos].splice(start, end)
    }
    const createRoom = async (a, pos) => {
        // if we splice already have 5 user the splice it out
        a.length >= 5 ? spliceUser(0, a.length, pos) : {}
        let roomId = a[0].room
        // let roomCurrent = await cm.get(roomId) || []
        let users = []
        let roomCurrent = await Message.findById({ "_id": roomId }).exec()
        if (!roomCurrent) {
            let obj = new Message({
                _id: roomId,
                user: a.map((x) => x.id)
            })
            obj.save(async (err, succes) => {
                if (err) console.log(err)
                else {
                    for await (value of a) {
                        users.push(value.id)
                        User.findByIdAndUpdate({ "_id": value.id }, { $push: { "messageList": roomId } }).exec((err, succes) => {
                            if (err) console.log(err)
                        })
                    }
                }
            })
            return { idRoom: roomId, have: null }
        }
        for await (value of a) {
            if (roomCurrent && roomCurrent.user.indexOf(value.id) === -1) {
                users.push(value.id)
                User.findByIdAndUpdate({ "_id": value.id }, { $push: { "messageList": roomId } }).exec((err, succes) => {
                    if (err) console.log(err)
                })
            }
            // the condition here is stop users push in case already have room and id already too
            else if (!roomCurrent) {
                users.push(value.id)
            }
        }
        if (users.length <= 0) return { idRoom: roomId, yet: "yet" }
        users.length > 0 && Message.findByIdAndUpdate({ "_id": roomId }, { $set: { "user": users } }).exec()

        return { idRoom: roomId, have: null }
    }
    // main structure
    // "g" mean group                                                                                                   
    const user = { id, room: id + len + "g" }
    for (let i in regionGroup) {
        if (regionGroup[i].length > 0) {
            regionGroup[i].push(user)
            if (regionGroup[i].length >= 2) {
                let a = regionGroup[i].slice(0, 5)
                return createRoom(a, ipOfUser)
            }
        }
    }
    regionGroup[ipOfUser].push(user)
    return { idRoom: user.room, yet: "yet", have: null }
}
const outChat = ({ id, len }) => {

}
const sendFile = ({ room, image, userId, originName, type }) => {
    let path = generatePath(userId, originName, type)
    const dir = `./uploads/${userId}/message/`
    let data = {
        image: userId + "/message/" + path,
        id: userId,
        seen: false
    }
    const fnc = () => {
        fs.writeFile(dir + path, image["0"], "binary", (err) => {
            if (err) return { err: "yes" }
        })
    }
    Message.findByIdAndUpdate({ "_id": room }, { $push: { "data": data } }).exec((err, succes) => {
        if (err) {
            return { message: data, err: "yes" }
        } else {
            fs.exists(dir, exist => {
                if (exist === false) {
                    return fs.mkdir(dir, { recursive: true }, err => {
                        if (!err) fnc()
                    });
                } else fnc()
            })
        }
    })
    return { message: data, err: null }
}

const reqShot = async ({ id, idUser, value, idPost }) => {
    // id:  user send request 
    // value: content id send
    // idUser: user's shot
    let d = new Date()
    let n = d.getTime()

    let name1 = decryptWithAES(id)
    let name2 = decryptWithAES(idUser)
    let idRoom = name1 + idPost
    if (name1 === name2) {
        return {
            succes: false
        }
    }
    let date = new Date()
    date = date.getTime()
    let mess = {
        data: [value],
        seen: false,
        idRoom,
        type: "shot",
        id: name1,
        date: Math.ceil(date)
    }

    let exists = await Message.findById({ "_id": idRoom }).exec()
    let res = { idRoom: idRoom, data: mess, user: name1 }
    if (!exists) {
        const obj = new Message({
            _id: idRoom,
            user: [name1, name2],
            data: [mess],
        })
        obj.save((err, succes) => {
            if (err) {
                return { succes: false }
            }
            else {
                User.findByIdAndUpdate({ "_id": name2 }, { $push: { "messageList": { "$each": [idRoom], "$position": 0 } } }, (err, succes) => {
                    if (err) console.log(err)
                })
            }
        })

        return {
            succes: true,
            idRoom,
            idUserPost: name2,
            mess: res
        }
    } else {
        sendMessage({ room: idRoom, message: value, id: name1, type: "shot" })
        return {
            succes: true,
            idRoom,
            idUserPost: name2,
            mess: res
        }
    }
}
module.exports = { addUser, sendMessage, seenMessage, sendFile, chatGorup, outChat, reqShot };