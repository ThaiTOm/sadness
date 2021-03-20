const mongoose = require("mongoose");
const crypto = require("crypto");


const UserSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    email: {
        type: String,
    },
    name: {
        type: String,
        trim: true,
    },
    hased_password: {
        type: String,
    },
    salt: String,
    resetPasswordLink: {
        data: String,
        default: ""
    },
    // so lan block
    blockN: {
        default: 0,
        type: Number
    },
    likes: {
        type: Array,
        default: []
    },
    lastOffline: {
        type: String
    },
    messageList: {
        type: Array,
        default: []
    }
}, { timeStamp: true })

UserSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hased_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })
UserSchema.methods = {
    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    },
    encryptPassword: function (password) {
        if (!password) {
            return ''
        }
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },
    authenicate: function (plainPassword) {
        return this.encryptPassword(plainPassword) === this.hased_password
    }
}
exports.User = mongoose.model("User", UserSchema)
