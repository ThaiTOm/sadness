const { check } = require("express-validator");
exports.validRegister = [
    check("name", "Name is required").notEmpty()
        .isLength({
            min: 4,
            max: 32
        }).withMessage("name must at least at 4"),
    check("email", "Email is required").isEmail().withMessage("Must a valid email"),
    check("password", "Password is required").notEmpty(),
    check("password").isLength({
        min: 6
    }).withMessage("Password must be at least 6 character")
        .matches(/\d/)
        .withMessage("Password must contain number")
]
exports.validLogin = [
    check("password", "Password is required").notEmpty()
]
exports.forgetPassword = [
    check("email").isEmpty()
        .not()
        .isEmail()
        .withMessage("Must be valid email")
]
exports.resetPassword = [
    check("newPassword")
        .not()
        .isEmpty()
        .isLength({
            min: 6
        })
        .withMessage("Must have at least at 6 character")
]