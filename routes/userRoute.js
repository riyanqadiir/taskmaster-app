const express = require("express")

const router = express.Router();
const {validateSignup,validateLogin,verifyRefreshToken} = require("../midleware/authMiddleware")
const {signup , login,refreshToken}  = require("../controller/userController")

router.post("/signup",validateSignup,signup)

router.post("/login",validateLogin,login)

router.post('/refresh-token', verifyRefreshToken, refreshToken);

module.exports = router;