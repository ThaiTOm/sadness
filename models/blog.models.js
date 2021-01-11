const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    user: {
        type: String, 
        require: true
    },
    content:{
        type: Object, 
        require: true
    }
})
exports.Blog = mongoose.model("Blog", blogSchema)
