const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    likes: {
        type: Number,
        default: 0
    },
    comment: {
        type: Array,
        default: null
    },
    commentNumber: {
        type: Number,
        default: 0
    }
}, { timestamps: true })
exports.Blog = mongoose.model("Blog", blogSchema)
