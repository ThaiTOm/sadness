const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    user: {
        type: Array
    },
    data: {
        type: Array,
        default: []
    }
})
exports.Message = mongoose.model("Message", messageSchema)