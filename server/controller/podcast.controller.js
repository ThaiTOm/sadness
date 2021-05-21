const CryptoJS = require("crypto-js")
const helperAudio = require("../helpers/audioRoom")
const { cm } = require("../nodeCache")

exports.createRoom = (req, res) => {
    // id: User's id
    // text: descrbie
    // howL: how many user can join the room 
    let { id, text, tag, howL } = req.body
    let d = new Date()
    d = d.getTime()
    const passphrase = '123nguyenduythaise1';
    // create id and replace all special char
    id = CryptoJS.AES.encrypt(id, passphrase).toString().replace(/[^\w\s]/gi, '')
    tag = tag ? tag.split("@").slice(1, tag.length) : null
    text = text.split(/\r\n|\r|\n/)
    let obj = { text, tag, howL, users: [id] }

    return cm.get("rooms")
        .then(async (value) => {
            if (!value) helperAudio.createDB(id + d)
            else helperAudio.pushData(id + d, value)
            try {
                await cm.set(id + d, obj)
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
    // get id all rooms 
    cm.get("rooms")
        .then(async (value) => {
            if (value) {
                // push to array 
                let data = await helperAudio.getAllRooms(value)
                return res.json(data)
            } else {
                return res.json(null)
            }
        })
}