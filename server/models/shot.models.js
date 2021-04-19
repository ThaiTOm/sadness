const mongoose = require("mongoose")

const shotSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    data: {}
})
exports.Shot = mongoose.model("Shot", shotSchema)
