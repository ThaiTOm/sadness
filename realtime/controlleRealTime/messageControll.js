const { arrOfRegion } = require("../../region");
const { cutSpaceInString } = require("../../a-client/src/algorithm/algorithm");
const redis = require("redis");
// const client = redis.createClient();
// const promisify = require('util').promisify;
const memcachePlus = require("memcache-plus")
const cm = new memcachePlus()

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
    const createRoom = (a, pos) => {
        let name1 = a[0].id
        let name2 = a[1].id
        let roomChatId = a[0].room
        // we get first id in the room and set that id to id room
        // get 2 items first in the array
        arrOfRegion[pos].splice(0, 2)
        // First we need to add Room Id to their account to find faster
        cm.add(name1, roomChatId + ",")
            .then(() => {
            })
            .catch(() => {
                cm.append(name1, roomChatId + ",")
            })
        cm.add(name2, roomChatId + ",")
            .then(() => {
            })
            .catch(() => {
                cm.append(name2, roomChatId + ",")
            })
        // then move it to messSave
        let firstValue = [name1 + "," + name2]
        cm.add(roomChatId, firstValue)
        // client.expire(roomChatId, 36600)
        return { idRoom: roomChatId }
    }
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
                    // Use logic here
                    let a = arrOfRegion[ipOfUser];
                    // Check if 2 people here not block each other
                    let arr = await cm.get(a[0].id + "blackList")
                    for (let i = 1; i < a.length; i++) {
                        //check if that one is not from the list
                        if (arr === null) {
                            let arg = [a[0], a[i]]
                            return createRoom(arg, ipOfUser)
                        } else if (arr.includes(a[i].id) === false) {
                            let arg = [a[0], a[i]]
                            //pass data to createRoom function and return that
                            return createRoom(arg)
                        }
                    }
                    return { idRoom: user.room, yet: "yet" }
                }
                return { idRoom: user.room }
            } else if (arrOfRegion[i].length > 0) {
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
                        if (arr === null) {
                            let arg = [a[0], a[x]]
                            return createRoom(arg, x)
                        } else if (arr.includes(a[x].id) === false) {
                            let arg = [a[0], a[x]]
                            //pass data to createRoom function and return that
                            return createRoom(arg, x)
                        }
                    }
                    return { idRoom: user.room, yet: "yet" }
                }

                return { idRoom: user.room, yet: "yet" }
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
    cm.get(room)
        .then((value) => {
            let arr = [...value]
            arr.push(mess)
            cm.replace(room, arr)
        })
    return { roomMessage: room, messageMessage: message, memberMessage: id }
}

const sendMessageOff = ({ room, message, id }) => {
    let mess = message + "," + id + "," + "false"
    cm.get(room)
        .then((value) => {
            let arr = [...value]
            arr.push(mess)
            cm.replace(room, arr)
        })
    return { roomMessage: room, messageMessage: message, memberMessage: id }
}
const sendImageOff = ({ room, image, userId }) => {
    let mess = "image," + image + ";" + userId
    cm.get(room)
        .then((value) => {
            let arr = [...value]
            arr.push(mess)
            cm.replace(room, arr)
        })

    return { roomMessage: room, message: "image," + image, member: userId }
}

const seenMessage = async ({ id, user1, user2 }) => {
    let getM = await cm.get(id)
    let arr = getM[getM.length - 1].split(",")
    if (arr[2] === "false") {
        arr[2] = "true"
        let old = [...getM]
        old[old.length - 1] = arr.join(",")
        cm.replace(id, old)
    }

}

module.exports = { addUser, sendMessage, sendMessageOff, seenMessage, sendImageOff };