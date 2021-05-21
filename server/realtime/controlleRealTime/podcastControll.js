const { cm } = require("../../nodeCache")


const joinPodcast = async ({ id, name }) => {
    try {
        let room = await cm.get(id)
        room["users"].push(name)
        let newArr = room
        cm.replace(id, newArr)
        return { arr: newArr, err: null }
    } catch (error) {
        return { err: "err" }
    }

}
module.exports = { joinPodcast }