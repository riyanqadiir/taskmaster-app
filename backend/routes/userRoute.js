const express = require("express")

const router = express.Router();
const {
    validateSignup,
    validateLogin,
    validateOtp,
    validateResendOtp,
    validateForgotPassword,
    validateResetPassword,
    verifyToken,
    verifyRefreshToken
} = require("../middleware/authMiddleware");

const {
    signup,
    login,
    refreshToken,
    OtpVerification,
    resendOtp,
    logout,
    forgotPassword,
    getForgotPassword,
    resetPassword
} = require("../controller/userController");

const { body } = require("express-validator");

router.post("/signup", validateSignup, signup)

router.post("/login", validateLogin, login)

router.post('/refresh-token', verifyRefreshToken, refreshToken);

router.post("/verify-otp", validateOtp, OtpVerification)

router.post("/resend-otp", validateResendOtp,resendOtp)

router.post("/forgot-password",validateForgotPassword,forgotPassword)

router.get("/forgot-password/:token", getForgotPassword)

router.post("/reset-password/:token",validateResetPassword,resetPassword)




router.post("/logout", verifyToken, logout);

module.exports = router;