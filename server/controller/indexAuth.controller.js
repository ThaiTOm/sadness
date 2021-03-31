const _ = require("lodash");

const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/dbErrorHandle");
const sgEmail = require("@sendgrid/mail");
const { User } = require("../models/user.models");
const { Idea } = require("../models/idea.models");

const { cm } = require("../nodeCache");
var mongoose = require('mongoose');


sgEmail.setApiKey("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")

exports.registerController = (req, res) => {
    const { name, email, password, } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        User.findOne({
            email
        }).exec((err, user) => {
            if (user) {
                return res.status(400).json({
                    error: email + " already have"
                })
            }
        })
        const token = jwt.sign(
            {
                name,
                password,
                email
            }, process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: "5m"
            }
        )

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Account activision link",
            html: `
               <h1>Please click to the link below</h1>
               <p>${process.env.CLIENT_URL}/users/active/${token}</p>
               <hr/>
               <p>This email contain sensetive info</p>
               <p> ${process.env.CLIENT_URL} </p>
            `
        }
        sgEmail.send(emailData).then((sent) => {
            return res.json({
                message: `Email has been sent to ${email}`
            })
        }).catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            })
        })
    }
}

exports.activationController = (req, res) => {
    const { token } = req.body;
    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    error: "Expired Token signup again"
                })
            } else {
                const { name, email, password } = jwt.decode(token);
                var id = mongoose.Types.ObjectId();
                const user = new User({
                    _id: id,
                    name,
                    email,
                    password
                })
                user.save((err, user) => {
                    if (err) {
                        console.log(err)
                        return res.status(401).json({
                            error: errorHandler(err)
                        })
                    }
                })
                const token_send = user["_id"]
                cm.set(token_send.toString(), "online")
                    .then(function () {
                    })
                    .catch(err => {
                        console.log(err)
                    })
                return res.json({
                    token: token_send,
                    user: user.name,
                    success: true,
                    message: "Signup success",
                })
            }
        })
    } else {
        return res.json({
            message: "Error happening please try again"
        })
    }
}

exports.loginController = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        User.findOne({
            email
        }).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "Emaail or password was wrong. Please try again"
                })
            }
            if (!user.authenicate(password)) {
                return res.status(400).json({
                    error: "Emaail or password was wrong. Please try again"
                })
            }
            const token = user._id
            const { email, name, blockN } = user;
            return res.json({
                token,
                user_email: email,
                user: name,
                blockN,
                message: "Signin succes"
            })
        })
    }
}
exports.forgetPasswordController = (req, res) => {
    const { email } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(402).json({
                error: "User does not exist"
            })
        }
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_RESET_PASSWORD, {
            expiresIn: "5m"
        })
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Account reset password",
            html: `
               <h1>Please click to the link below</h1>
               <p>${process.env.CLIENT_URL}/users/password/forget/${token}</p>
               <hr/>
               <p>This email contain sensetive info</p>
               <p> ${process.env.CLIENT_URL} </p>
            `
        }
        return user.updateOne({
            resetPasswordLink: token
        }, (err, success) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            } else {
                sgEmail.send(emailData).then(sent => {
                    return res.json({
                        message: "Email has been sent to " + email
                    }).catch(err => {
                        return res.json({
                            message: err.message
                        })
                    })
                })
            }
        })
    })
}
exports.changePasswordController = (req, res) => {
    const { newPassword, passwordLink } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        if (passwordLink) {
            jwt.verify(passwordLink, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
                if (err) {
                    return res.json({
                        error: "Your verify link is wrong please try again"
                    })
                }

                User.findOne({ resetPasswordLink: passwordLink }, (err, user) => {
                    if (err || !user) {

                        return res.status(400).json({
                            error: "Something was wrong.Try again "
                        })
                    }
                    const updatePassword = {
                        password: newPassword,
                        passwordLink: ""
                    }
                    user = _.extend(user, updatePassword);
                    user.save((err, result) => {
                        if (err) {
                            res.status(400).json({
                                error: "Something was wrong. Please try again"
                            })
                        } else {
                            res.json({ message: "Your password was change" })
                        }
                    })
                })
            })
        }
    }
}

const client = new OAuth2Client("583969708221-h0kl5ki0e91mkb3mafoecak1sj8b4ih3.apps.googleusercontent.com")
exports.googleController = (req, res) => {
    const { idToken } = req.body;
    client.verifyIdToken({ idToken, audience: "583969708221-h0kl5ki0e91mkb3mafoecak1sj8b4ih3.apps.googleusercontent.com" })
        .then(response => {
            const { email_verified, name, email } = response.payload;
            if (email_verified) {
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = user._id
                        const { _id, email, name } = user;
                        return res.json({
                            token,
                            user_email: email,
                            user: name,
                            message: "Đăng nhập thành công. Hãy trải lòng nhé!"
                        })
                    } else {
                        let password = email + process.env.JWT_SECRET;
                        var id = mongoose.Types.ObjectId();
                        user = new User({ "_id": id, name, email, password })
                        user.save((err, data) => {
                            if (err) {
                                res.status(400).json({
                                    error: errorHandler(err)
                                })
                            }
                            const token = id
                            cm.set(data.id, "online")
                                .then(function () {

                                })
                            const { email, name, _id } = data;
                            return res.json({
                                token,
                                user: { email, name, _id }

                            })
                        })
                    }
                })
            } else {
                res.status(400).message({
                    error: "Login with Google Failed"
                })
            }
        })
}

exports.facebookController = (req, res) => {
    const { userID, accessToken } = req.body;
    const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;
    return (
        fetch(url, {
            method: "GET"
        }).then(response => response.json())
            .then(response => {
                const { email, name, id } = response

                let fnc = (field, value) => {
                    User.findById({ "_id": value }).exec((err, user) => {
                        if (user) {
                            const token = user._id
                            const { _id, name } = user;
                            const value = user[field]
                            return res.json({
                                token,
                                _user_email: value,
                                user: name
                            })
                        } else {
                            let password = field + process.env.JWT_SECRET;
                            let user
                            if (field === "_id") {
                                user = new User({
                                    _id: value,
                                    name,
                                    password
                                })
                            } else {
                                user = new User({
                                    email: value,
                                    name,
                                    password
                                })
                            }
                            user.save((err, data) => {
                                if (err) {
                                    return res.status(400).json({
                                        error: "Try again please"
                                    })
                                }
                                const token = data._id
                                cm.set(token.toString(), "online")
                                    .then(function () {

                                    })
                                const { name, field } = data;
                                return res.json({
                                    token,
                                    _user_email: field,
                                    user: name
                                })
                            })
                        }
                    })
                }
                email ? fnc("email", email) : fnc("_id", id)
            }).catch(err => {
                res.json({
                    error: "Login failed with Facebook"
                })
            })
    )
}
exports.ideaFromUserController = (req, res) => {
    const { text, file } = req.body
    const idea = new Idea({
        text,
        file
    })
    idea.save((err, data) => {
        if (err) {
            return res.status(401).json({
                error: errorHandler(err)
            })
        } else {
            return res.json({
                message: "Cảm ơn vì những ý kiến đóng góp của bạn"
            })
        }
    })
}