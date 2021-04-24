const { addUser, sendMessage, sendMessageOff, seenMessage, chatGorup, outChat, sendFile } = require("./controlleRealTime/messageControll");
const { comment, likeBlog, likeCmt } = require("./controlleRealTime/newsControll")
const { Message } = require("../models/message.model");
const { cm } = require("../nodeCache");
const date = require("date-and-time");
const fs = require("fs");
const { generatePath } = require("../helpers/generatePath");


module.exports = {
    index: function (io, socket) {
        socket.on('joinChat', async ({ id, len, ipOfUser }, callback) => {
            const { yet, have, idRoom } = await addUser({ id, len, ipOfUser });
            if (yet) callback("error")
            else if (have) return callback("error")
            else {
                callback(idRoom)
                socket.broadcast.to(idRoom).emit('message', { user: 'admin', roomId: idRoom });
            }
            socket.join(idRoom)
            callback();
        });
        socket.on("joinChatGroup", async ({ id, len, ipOfUser }, callback) => {
            const { have, idRoom, yet } = await chatGorup({ id, len, ipOfUser })
            if (yet) callback("error")
            else if (have) return callback("error")
            else {
                callback(idRoom)
                socket.broadcast.to(idRoom).emit('message', { group: 'admin', roomId: idRoom });
            }
            socket.join(idRoom)
            callback()
        })
        socket.on("joinChatBack", ({ idRoom }) => {
            socket.join(idRoom)
        })
        socket.on('sendMessage', ({ room, message, id }, callback) => {
            const { roomMessage,
                messageMessage,
                memberMessage
            } = sendMessage({ room, message, id });

            io.to(roomMessage).emit('message', {
                data: messageMessage.data,
                seen: false,
                idRoom: room,
                type: "message",
                id: id,
            });
            callback();
        });
        socket.on("sendMessageOff", async ({ room, message, userId, file }) => {
            const { roomMessage, messageMessage, memberMessage } = await sendMessageOff({ room, message, id: userId })
            io.to(roomMessage).emit("message", {
                data: messageMessage,
                seen: false,
                idRoom: room,
                type: "message",
                id: userId,
            })
        });
        socket.on("file", async ({ room, image, userId, originName }) => {
            const { message, err } = sendFile({ room, image, userId, originName });
            io.to(room).emit("message", { user: userId, image: message, idRoom: room, err: err })
        })
        socket.on("seenMessage", ({ id, userId }) => {
            seenMessage({ id, userId })
        })
        socket.on("join", ({ id }) => {
            cm.set(id, "online")
            socket.join(id)
        })
        socket.on("comment", async ({ idRecieve, idSent, value }, callback) => {
            const { user, error, type, number } = await comment({ idRecieve, idSent, value })
            if (error) {
                return callback(error)
            } if (user) {
                callback("ok")
                io.to(user.user).emit("activities", { type, value: " người đã bình luận về bài viết của bạn", number })
            } else {
                callback("ok")
            }
        })
        socket.on("like", async ({ value, id }, callback) => {
            const { error, message, user, type, number } = await likeBlog({ value, id })
            if (error) {
                return callback("error")
            } else if (message) {
                callback("message")
                io.to(user).emit("activities", { type, value: " người đã thích bài viết của bạn", number })
            }
        })
        socket.on("likeCmt", async ({ value, id, idComment }, callback) => {
            const { error, message, user, type, number } = await likeCmt({ value, id, idComment })
            if (error === false) {
                return callback("Đã có lỗi xảy ra bạn hãy thử lại sau")
            } if (message === "exists") {
                return callback(message)
            } if (user) {
                io.to(user).emit("activities", { type, value: " người đã thích bình luận của bạn", number })
            }
        })
        socket.on("chatVideo", async ({ id, idRoom, g }, callback) => {
            let fc = async () => {
                let value = await Message.findById({ "_id": idRoom }).exec()
                return value.user
            }
            let value = await fc()
            callback(value)
            socket.to(idRoom).broadcast.emit("user-connect", { id, idRoom })
        })
        socket.on("offline", async ({ id }) => {
            let d = new Date()
            d = date.format(d, 'YYYY/MM/DD HH:mm:ss');
            cm.set(id, d)
                .then(() => { })
                .catch(() => {
                    console.log(id)
                })
        })
        socket.on("outJoinChat", ({ id }) => {
            return outChat({ id })
        })
    }
}

