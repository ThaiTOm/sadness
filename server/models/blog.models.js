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
    },
    createdAt: {
        type: Number,
        default: Date.now
    },
    text: {
        type: Array
    },
    image: {
        type: Array
    }
})
exports.Blog = mongoose.model("Blog", blogSchema)
