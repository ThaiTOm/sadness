const { addUser, sendMessage, sendMessageOff } = require("./messageControll");

module.exports = {
    index: function (io, socket) {
        socket.on('join', ({ id, len, ipOfUser }, callback) => {
            const { yet, have, idRoom } = addUser({ id, len, ipOfUser });
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
        socket.on("joinBack", ({ idRoom }) => {
            socket.join(idRoom)
        })

        socket.on('sendMessage', ({ room, message, id }, callback) => {
            const { roomMessage,
                messageMessage,
                memberMessage
            } = sendMessage({ room, message, id });

            io.to(roomMessage).emit('message', { user: memberMessage, text: messageMessage });

            callback();
        });
        socket.on("sendMessageOff", ({ room, message, userId }) => {
            const { roomMessage, messageMessage, memberMessage } = sendMessageOff({ room, message, id: userId })
            io.to(roomMessage).emit("message", { user: memberMessage, text: messageMessage, idRoom: room })
        });
        // socket.on("addF", ({ id }, callback) => {
        //     const { room, req, res, time } = addFriend({ id })
        //     io.to(room).emit("receive", { time: time })
        // })
    }
}