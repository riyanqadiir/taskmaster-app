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
    verifyRefreshToken,
    verifyCaptcha
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
    resetPassword,
    getMe,
    checkToken
} = require("../controller/userController");

const { body } = require("express-validator");

router.post("/signup", verifyCaptcha, validateSignup, signup)

router.post("/login",verifyCaptcha, validateLogin, login)

router.post('/refresh-token', verifyRefreshToken, refreshToken);

router.post("/verify-otp",verifyCaptcha, validateOtp, OtpVerification)

router.post("/resend-otp",verifyCaptcha, validateResendOtp, resendOtp)

router.post("/forgot-password",verifyCaptcha, validateForgotPassword, forgotPassword)

router.get("/forgot-password/:token", getForgotPassword)

router.post("/reset-password/:token", validateResetPassword, resetPassword)

router.get("/verify-token",verifyToken, checkToken)

router.get("/me",verifyToken,getMe)


router.post("/logout", verifyToken, logout);

module.exports = router;