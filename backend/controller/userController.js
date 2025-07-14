// models
const userModel = require("../model/User")
const profileModel = require("../model/userProfile.js")
const accControlModel = require("../model/AccountControl")
const verificationModel = require("../model/Verification.js")
const metaModel = require("../model/UserMetadata.js")

// dependencies
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const verifyEmail = require("../service/NodeMailer.js")
const otpGenerator = require('otp-generator')
const crypto = require("crypto")

const signup = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    const otp = String(otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false }))
    const { firstName, lastName, username, email, password } = req.body;
    try {
        const existingEmail = await userModel.findOne({ email }).session(session);
        if (existingEmail) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Account already created" });
        }

        const existingUsername = await userModel.findOne({ username }).session(session);
        if (existingUsername) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Username already taken" });
        }

        const EmailResponse = await verifyEmail(email, { otp: otp })
        if (!EmailResponse) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Failed to send Email" });
        }
        const user = new userModel({ firstName, lastName, username, email, password });
        await user.save({ session });

        const profile = new profileModel({ userId: user._id })
        const accControl = new accControlModel({ userId: user._id, status: "pending", statusReason: "User Signup Successfully!" })
        const verification = new verificationModel({ userId: user._id, otp: otp, otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000) })
        const metaData = new metaModel({ userId: user._id })

        await Promise.all([
            profile.save({ session }),
            accControl.save({ session }),
            verification.save({ session }),
            metaData.save({ session })
        ]);

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: "user signup successfully!", body: { email: user.email } })
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err)
        res.status(500).json({ message: "server error" })
    }
}

const OtpVerification = async (req, res) => {
    const { email } = req.body;
    const otp = String(req.body.otp)
    const option = {
        otp: otp
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User with this email not found" });
        }

        const verifyUser = await verificationModel.findOne({ userId: user._id }).select('+otp');

        if (!verifyUser) {
            return res.status(404).json({ message: "User has no verification record" });
        }

        if (verifyUser.otpBlockedUntil && verifyUser.otpBlockedUntil > new Date()) {
            const remaining = Math.ceil((verifyUser.otpBlockedUntil - new Date()) / 60000);
            return res.status(403).json({ message: `Too many failed attempts. Try again in ${remaining} minutes.` });
        }

        if (verifyUser.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (verifyUser.otpExpiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }
        const otpIsValid = await verifyUser.compareOtp(otp)
        if (!otpIsValid) {
            return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
        }

        verifyUser.isVerified = true;
        verifyUser.otpRequestCount = 0;
        await verifyUser.save();

        return res.status(200).json({ message: "User verified successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const resendOtp = async (req, res) => {
    const { email } = req.body;
    const otp = String(otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false }));
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const verifyUser = await verificationModel.findOne({ userId: user._id });

        if (!verifyUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (verifyUser.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (verifyUser.otpBlockedUntil && verifyUser.otpBlockedUntil > new Date()) {
            const minutes = Math.ceil((verifyUser.otpBlockedUntil - new Date()) / 60000);
            return res.status(429).json({ message: `Too many OTP requests. Please wait ${minutes} minute(s) before trying again.` });
        }

        verifyUser.otpRequestCount = (verifyUser.otpRequestCount || 0) + 1;
        if (verifyUser.otpRequestCount >= 3) {
            verifyUser.otpBlockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            verifyUser.otpRequestCount = 0;
        }

        verifyUser.otp = otp;
        verifyUser.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await verifyUser.save();

        const emailSent = await verifyEmail(email, { otp: otp });
        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send OTP" });
        }
        return res.status(200).json({ message: "New OTP sent successfully!" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

const login = async (req, res) => {
    const { email, password, remember_me = false } = req.body;

    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const verifyUser = await verificationModel.findOne({ userId: user._id });

        if (!verifyUser || !verifyUser.isVerified) {
            return res.status(404).json({ message: "User is not verified" });
        }

        const accModel = await accControlModel.findOne({ userId: user._id })
        let metadata = await metaModel.findOne({ userId: user._id });

        if (!accModel || !metadata) {
            return res.status(500).json({ message: "User account setup incomplete. Contact support." });
        }

        if (metadata.lockUntil && metadata.lockUntil > Date.now()) {
            return res.status(403).json({ message: "Account temporarily locked. Try again later." });
        }

        const passIsValid = await user.comparePassword(password)
        if (!passIsValid) {
            metadata.loginAttempts += 1;

            if (metadata.loginAttempts >= 5) {
                metadata.lockUntil = Date.now() + 15 * 60 * 1000;
            }
            await metadata.save();
            return res.status(400).json({ message: "Invalid credentials" });
        }

        accModel.status = "active"
        accModel.statusReason = "User Logged In Successfully!"


        metadata.loginAttempts = 0;
        metadata.lockUntil = null;
        metadata.lastLoginAt = new Date();

        await metadata.save();
        await accModel.save()
        await user.save()


        const accessToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })

        if (remember_me) {
            const refreshToken = jwt.sign(
                { _id: user._id },
                process.env.REFRESH_SECRET_KEY,
                { expiresIn: '1d' }
            );

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 24 * 60 * 60 * 1000, //1 days
            });
        }

        return res.header('authorization', accessToken)
            .status(200)
            .json({
                message: "User logged in successfully!",
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    username: user.username,
                    email: user.email
                }
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
const refreshToken = (req, res) => {
    try {
        const userId = req.user._id;
        const accessToken = jwt.sign({ _id: userId }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.header('authorization', accessToken)
            .status(200)
            .json({ message: "Token refreshed successfully!", user: userId });
    } catch (err) {
        console.error("Refresh token error:", err.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const logout = async (req, res) => {
    const userId = req.user._id;
    try {
        const user = await userModel.findById(userId);
        const accModel = await accControlModel.findOne({ userId: user._id })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // if (!user.isLoggedIn) {
        //     return res.status(400).json({ message: "User is already logged out" });
        // }

        accModel.status = "pending"
        accModel.statusReason = "User Logged Out Successfully!"
        // user.isLoggedIn = false;

        await accModel.save()
        // await user.save();

        return res.clearCookie("refreshToken")
            .status(200)
            .json({ message: "User logged out successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userModel.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (
            user.lastPasswordChanged &&
            Date.now() - new Date(user.lastPasswordChanged).getTime() < 10 * 24 * 60 * 60 * 1000
        ) {
            const timeLeftMs = 10 * 24 * 60 * 60 * 1000 - (Date.now() - new Date(user.lastPasswordChanged).getTime());
            const daysLeft = Math.floor(timeLeftMs / (24 * 60 * 60 * 1000));
            const hoursLeft = Math.floor((timeLeftMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

            return res.status(403).json({
                message: `You can only change your password every 10 days. Try again in ${daysLeft} day(s) and ${hoursLeft} hour(s).`
            });
        }

        let resetPasswordToken;
        try {
            resetPasswordToken = await user.getResetPasswordToken();
        } catch (err) {
            return res.status(429).json({ message: err.message });
        }
        await user.save();

        const resetPasswordUrl = `${req.protocol}://${req.get("host").split(':')[0]}:3000/user/forgot-password/${resetPasswordToken}`;

        const emailSent = await verifyEmail(email, { reset_url: resetPasswordUrl });

        if (!emailSent) {
            return res.status(500).json({ message: "Failed to send email" });
        }

        return res.status(200).json({ message: "Password reset link sent!" });

    } catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const getForgotPassword = async (req, res) => {
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    try {
        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).send("Invalid or expired password reset token.");
        }

        return res.render("reset-password.ejs", {
            token,
            email: user.email
        });

    } catch (err) {
        console.error("Get forgot password error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { email, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    try {
        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpiry: { $gt: Date.now() },
            email: email.toLowerCase().trim(),
        });

        if (!user) {
            return res.status(404).json({ message: "Invalid or expired token" });
        }

        if (
            user.lastPasswordChanged &&
            Date.now() - new Date(user.lastPasswordChanged).getTime() < 10 * 24 * 60 * 60 * 1000
        ) {
            const timeLeftMs = 10 * 24 * 60 * 60 * 1000 - (Date.now() - new Date(user.lastPasswordChanged).getTime());
            const daysLeft = Math.floor(timeLeftMs / (24 * 60 * 60 * 1000));
            const hoursLeft = Math.floor((timeLeftMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

            return res.status(403).json({
                message: `You can only change your password every 10 days. Try again in ${daysLeft} day(s) and ${hoursLeft} hour(s).`
            });
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpiry = null;
        user.passwordResetCount = 0;
        user.lastPasswordChanged = new Date();

        await user.save();

        return res.status(200).json({ message: "Password reset successfully!" });

    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};


module.exports = { signup, login, refreshToken, OtpVerification, resendOtp, logout, forgotPassword, getForgotPassword, resetPassword }