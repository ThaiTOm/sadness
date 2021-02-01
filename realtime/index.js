const { addUser, sendMessage, sendMessageOff, seenMessage, sendImageOff } = require("./controlleRealTime/messageControll");
const { comment, likeBlog, likeCmt } = require("./controlleRealTime/newsControll")

module.exports = {
    index: function (io, socket) {
        socket.on('joinChat', async ({ id, len, ipOfUser }, callback) => {
            const { yet, have, idRoom } = await addUser({ id, len, ipOfUser });
            if (yet) {
                callback("error")
            }
            else if (have) {
                return callback("error")
            }
            else {
                callback(idRoom)
                socket.broadcast.to(idRoom).emit('message', { user: 'admin', roomId: idRoom });
            }
            socket.join(idRoom)
            callback();
        });
        socket.on("joinChatBack", ({ idRoom }) => {
            socket.join(idRoom)
        })

        socket.on('sendMessage', ({ room, message, id }, callback) => {
            const { roomMessage,
                messageMessage,
                memberMessage
            } = sendMessage({ room, message, id });
            io.to(roomMessage).emit('message', { user: memberMessage, text: messageMessage, idRoom: roomMessage });

            callback();
        });
        socket.on("sendMessageOff", ({ room, message, userId }) => {
            const { roomMessage, messageMessage, memberMessage } = sendMessageOff({ room, message, id: userId })
            io.to(roomMessage).emit("message", { user: memberMessage, text: messageMessage, idRoom: room })
        });
        socket.on("sendImageOff", ({ room, image, userId }) => {
            const { roomMessage, message, member } = sendImageOff({ room, image, userId });
            io.to(room).emit("message", { user: member, image: message, idRoom: room })
        })
        socket.on("seenMessage", ({ id, user1, user2 }) => {
            seenMessage({ id, user1, user2 })
        })
        socket.on("join", ({ id }) => {
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
    }
}

