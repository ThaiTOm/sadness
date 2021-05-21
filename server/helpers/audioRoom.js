const { cm } = require("../nodeCache");

const helperAudio = (function () {
    return {
        createDB: (_id) => {
            cm.set("rooms", [_id])
                .then(() => { return { succes: "ok" } })
                .catch((error) => {
                    return { error }
                })
        },
        pushData: (_id, arr) => {
            arr.push(_id)
            cm.replace("rooms", arr)
                .then(() => {
                    return { succes: "ok" }
                })
                .catch((error) => {
                    cm.set("rooms", [])
                    return { error }
                })
        },
        getAllRooms: async (arr) => {
            let result = []
            for await (let id of arr) {
                let data = await cm.get(id)
                data["id"] = id
                result.push(data)
            }
            return result
        }
    }
})();

module.exports = helperAudio