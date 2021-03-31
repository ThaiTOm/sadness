const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema({
    // user: {
    //     type: String,
    //     require: true
    // },
    text: {
        type: String,
    },
    file: {
        type: Array
    }
})
exports.Idea = mongoose.model("Idea", ideaSchema)
