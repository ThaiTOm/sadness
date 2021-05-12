const CryptoJS = require("crypto-js")
const MemcachePlus = require('memcache-plus')
const helperAudio = require("../helpers/audioRoom")

const client = new MemcachePlus()



exports.createRoom = (req, res) => {
    // id: User's id
    // text: descrbie
    // howL: how many user can join the room 
    let { id, text, tag, howL } = req.body
    let d = new Date()
    d = d.getTime()
    const passphrase = '123nguyenduythaise1';
    id = CryptoJS.AES.encrypt(id, passphrase).toString();
    tag = tag.split("@").slice(1, tag.length)
    text = text.split(/\r\n|\r|\n/)
    let obj = { text, tag, howL, users: [id] }

    return client.get("rooms")
        .then(async (value) => {
            if (!value) helperAudio.createDB(id + d)
            else helperAudio.pushData(id + d, value)
            try {
                await client.set(id + d, obj)
                return res.json({
                    _id: id + d
                })
            } catch (error) {
                return res.json({
                    error: "eror"
                })
            }
        })
        .catch(() => {
            return res.json({ error: "error" })
        })
}
exports.getRooms = (req, res) => {
    let { start, end } = req.query
    client.get("rooms")
        .then(async (value) => {
            if (value) {
                let data = await helperAudio.getAllRooms(value)
                return res.json(data)
            } else {
                return res.json(null)
            }
        })
}