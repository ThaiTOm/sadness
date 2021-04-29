const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    file: {
        type: Array
    }
})
exports.Idea = mongoose.model("Idea", ideaSchema)
