const mongoose = require("mongoose")

const shotSchema = new mongoose.Schema({
    _id: {
        type: String
    }
})
exports.Shot = mongoose.model("Shot", shotSchema)
