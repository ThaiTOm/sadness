const { addUser, sendMessage, sendMessageOff, seenMessage, sendImageOff } = require("./messageControll");

module.exports = {
    index: function (io, socket) {
        socket.on('join', async ({ id, len, ipOfUser }, callback) => {
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
        socket.on("joinBack", ({ idRoom }) => {
            socket.join(idRoom)
        })

        socket.on('sendMessage', ({ room, message, id }, callback) => {
            const { roomMessage,
                messageMessage,
                memberMessage
            } = sendMessage({ room, message, id });
            io.to(roomMessage).emit('message', { user: memberMessage, text: messageMessage,idRoom:roomMessage });

            callback();
        });
        socket.on("sendMessageOff", ({ room, message, userId }) => {
            const { roomMessage, messageMessage, memberMessage } = sendMessageOff({ room, message, id: userId })
            io.to(roomMessage).emit("message", { user: memberMessage, text: messageMessage, idRoom: room })
        });
        socket.on("sendImageOff",({room,image,userId})=>{
            const {roomMessage, message, member} = sendImageOff({room,image,userId});
            io.to(room).emit("message", {user:member, image:message, idRoom:room})
            console.log(room)
        })
        socket.on("seenMessage", ({id,user1,user2})=>{
             seenMessage({id,user1,user2})
        })
        // socket.on("addF", ({ id }, callback) => {
        //     const { room, req, res, time } = addFriend({ id })
        //     io.to(room).emit("receive", { time: time })
        // })
    }
}
