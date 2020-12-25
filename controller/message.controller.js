const redis = require("redis");
const clientRedis = redis.createClient();
const promisify = require('util').promisify;


exports.getIdRooms = (req, res) => {
    const { id } = req.body;
    clientRedis.llen(id, (err, result) => {
        if (err) {
            return res.json({
                error: "Something went wrong, Please try again"
            })
        } else {
            clientRedis.lrange(id, 0, -1, (err, idRooms) => {
                if (err) {
                    return res.json({
                        error: "Something went wrong, Please try again"
                    })
                } else {
                    return res.json({
                        len: result,
                        idRooms: idRooms
                    })
                }
            })
        }
    })
}
exports.listContact = async (req, res) => {
    //id is idRoom
    const { id } = req.body
    const { start, end } = req.query
    let getLast = promisify(clientRedis.lrange).bind(clientRedis)
    let alrange = promisify(clientRedis.lrange).bind(clientRedis)
    const rang = await alrange(id, start, end)
    let arr = []
    for (let value of rang) {
        let a = await getLast(value, -2, -1)
        let b = await getLast(value, 0, 0)
        await a.push(b.join(""), value)
        arr.push(a)
    }
    res.json(arr)
}
exports.sendContactRoom = async (req, res) => {
    const { id, start, end } = req.query
    let lenMsg = promisify(clientRedis.llen).bind(clientRedis)
    // sfl === start from list
    let sfl = await lenMsg(id) - start
    let getMsg = promisify(clientRedis.lrange).bind(clientRedis)
    const msg = await getMsg(id, start, end)
    res.json(msg)
}
