const MemcachePlus = require('memcache-plus')

const client = new MemcachePlus()

const helperAudio = (function () {
    return {
        createDB: (_id) => {
            client.set("rooms", [_id])
                .then(() => { return { succes: "ok" } })
                .catch((error) => {
                    return { error }
                })
        },
        pushData: (_id, arr) => {
            arr.push(_id)
            client.replace("rooms", arr)
                .then(() => {
                    return { succes: "ok" }
                })
                .catch((error) => {
                    client.set("rooms", [])
                    return { error }
                })
        },
        getAllRooms: async (arr) => {
            let result = []
            for await (let id of arr) {
                let data = await client.get(id)
                data["id"] = id
                result.push(data)
            }
            return result
        }
    }
})();

module.exports = helperAudio