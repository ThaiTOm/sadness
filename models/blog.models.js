const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    _id: {
        type: String
    },
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
    }
})
exports.Blog = mongoose.model("Blog", blogSchema)
