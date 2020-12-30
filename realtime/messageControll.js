const { arrOfRegion } = require("../region");
const { cutSpaceInString } = require("../a-client/src/algorithm/algorithm");
const redis = require("redis");
const client = redis.createClient();
const promisify = require('util').promisify;

const addUser = async ({ id, ipOfUser, len }) => {
    // First check in messageSave already have this user or not
    ipOfUser = cutSpaceInString(ipOfUser);
    for (let i = 0; i < arrOfRegion[ipOfUser].length; i++) {
        if (arrOfRegion[ipOfUser][i].room === id + len) {
            return { have: "have" }
        }
    }

    // Create new variable that handle name and room of someone
    const user = { id: id, room: id + len };
    let x = 0;
    // Wait of check when user if join to some room
    while (x < 1) {
        // Run until the user find partner
        for (let i in arrOfRegion) {
            // Find if have anyone in that state(IP) has alone join to this
            if (arrOfRegion[ipOfUser].length > 0) {
                // If user of this region have more than 0 then push new user in
                arrOfRegion[ipOfUser].push(user);
                // If that region has more than 1 people than we get that out
                if (arrOfRegion[ipOfUser].length >= 2) {
                    // Use login here
                    const createRoom = (a) => {
                        let name1 = a[0].id
                        let name2 = a[1].id
                        let roomChatId = a[0].room
                        // we get first id in the room and set that id to id room
                        // get 2 items first in the array
                        arrOfRegion[ipOfUser].splice(0, 2)
                        // First we need to add Room Id to their account to find faster
                        client.rpush(name1, roomChatId)
                        client.rpush(name2, roomChatId)
                        // Expire when we will delete the value
                        client.expire(name1, 36600)
                        client.expire(name2, 36600)
                        // then move it to messSave
                        client.lpush(roomChatId, name1, name2, (err, res) => {
                            if (err) {
                                console.log(err)
                            }
                        })
                        client.expire(roomChatId, 36600)
                        // updateMessage(roomChat.name1, roomChat.room)
                        // updateMessage(roomChat.name2, roomChat.room)
                        return { idRoom: roomChatId }
                    }
                    let a = arrOfRegion[ipOfUser];
                    // Check if 2 people here not block each other
                    let getLrange = promisify(client.lrange).bind(client);
                    let arr = await getLrange(a[0].id + "blackList", 0, -1);

                    for (let i = 1; i < a.length; i++) {
                        //check if that one is not from the list
                        if (arr.includes(a[i].id) === false) {
                            let arg = [a[0], a[i]]
                            //pass data to createRoom function and return that
                            return createRoom(arg)
                        }
                    }
                    return { idRoom: user.room, yet: "yet" }
                }
                return { idRoom: user.room }
            } else {
                if (arrOfRegion[i].length > 0) {
                    arrOfRegion[i].push(user)
                    if (arrOfRegion[i].length % 2 === 0) {
                        let a = arrOfRegion[i].slice(0, 2);
                        let roomChatId = a[0].room
                        let name1 = a[0].id
                        let name2 = a[1].id
                        let roomChat = {
                            "id": roomChatId
                        };
                        // we get first id in the room and set that id to id room
                        // get 2 items first in the array
                        arrOfRegion[ipOfUser].splice(0, 2)

                        // then move it to messSave
                        client.rpush(name1, roomChatId)
                        client.rpush(name2, roomChatId)

                        client.expire(name1, 3600)
                        client.expire(name2, 3600)

                        client.hmset(roomChatId, "roomChatId", roomChatId)
                        client.expire(roomChatId, 3600)

                        // updateMessage(roomChat.name1, roomChat.room)
                        // updateMessage(roomChat.name2, roomChat.room)
                        return { idRoom: roomChatId }
                    }

                    return { idRoom: user.room }
                }
            }
        }
        // If no one is waiting than 
        arrOfRegion[ipOfUser].push(user)
        x += 1
    }
    return { idRoom: user.room, yet: "yet" };
}

const sendMessage = ({ room, message, id }) => {
    //mess contain message and id 
    let mess = message + "," + id + "," + "false"
    client.lpush(room, mess, (err, result) => {
        if (err) {
        }
    })

    return { roomMessage: room, messageMessage: message, memberMessage: id }
}

const sendMessageOff = ({ room, message, id }) => {
    let mess = message + "," + id + "," + "false"
    client.lpush(room, mess, (err, result) => {
    })
    return { roomMessage: room, messageMessage: message, memberMessage: id }
}
// const addFriend = ({ id }) => {
//     const arr = id.split(";")
//     const add = (req, res) => {
//         // req who send request, res receive request
//         let d = new Date();
//         let now = date.format(d, 'YYYY/MM/DD HH:mm:ss');
//         return { req, res, time: now }
//     }
//     if (arr[1] === arr[3]) {
//         let { req, res, time } = add(arr[1], arr[2])
//         return { room: arr[0], req, res, time }
//     } else {
//         let { req, res, time } = add(arr[2], arr[1])
//         return { room: arr[0], req, res, time }
//     }
// }
const seenMessage =  async ({ id, user1, user2 }) => {
    let getm = promisify(client.lrange).bind(client)
    const lastM = await getm(id,0,0)
    const arr = await lastM[0].split(",")
    arr[2] = "true"
    client.lset(id, 0, arr.join(","))
    
}
module.exports = { addUser, sendMessage, sendMessageOff, seenMessage };