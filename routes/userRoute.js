const express = require("express")

const router = express.Router();
const { validateSignup, validateLogin, verifyRefreshToken, validateOtp,verifyToken } = require("../middleware/authMiddleware")
const { signup, login, refreshToken, OtpVerification, resendOtp,logout } = require("../controller/userController");
const { body } = require("express-validator");

router.post("/signup", validateSignup, signup)

router.post("/login", validateLogin, login)

router.post('/refresh-token', verifyRefreshToken, refreshToken);

router.post("/verify-otp", validateOtp, OtpVerification)

router.post("/resend-otp", body('email')
    .isEmail().withMessage('A valid email is required')
    .customSanitizer(value => value.toLowerCase().trim()),
    resendOtp)

router.post("/logout", verifyToken, logout);

module.exports = router;