const express = require("express");
const { registerController, activationController, loginController, forgetPasswordController, changePasswordController, googleController, facebookController, ideaFromUserController } = require("../controller/indexAuth.controller");
const { getIdea } = require("../controller/news.controller");
const router = express.Router();
const { validLogin, validRegister, forgetPassword, resetPassword } = require("../helpers/valid")


router.post("/register", validRegister, registerController);
router.post("/activision", activationController)
router.post("/login", validLogin, loginController);
router.put("/password/forget", forgetPassword, forgetPasswordController);
router.put("/change/password", resetPassword, changePasswordController);
router.post("/googlelogin", googleController)
router.post("/facebooklogin", facebookController)
router.post("/idea", ideaFromUserController)
router.get("/suggest", getIdea)


module.exports = router