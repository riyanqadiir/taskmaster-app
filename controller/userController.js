// models
const userModel = require("../model/User")
const profileModel = require("../model/userProfile.js")
const accControlModel = require("../model/AccountControl")
const verificationModel = require("../model/verification.js")
const metaModel = require("../model/UserMetadata.js")

// dependencies
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const verifyEmail = require("../service/NodeMailer.js")
const otpGenerator = require('otp-generator')

const signup = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
    try {

        const { firstName, lastName, username, email, password } = req.body;
        const existingEmail = await userModel.findOne({ email }).session(session);
        if (existingEmail) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Email already in use" });
        }

        const existingUsername = await userModel.findOne({ username }).session(session);
        if (existingUsername) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Username already taken" });
        }

        const EmailResponse = await verifyEmail(email, otp)
        if (!EmailResponse) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Failed to send Email" });
        }
        const user = new userModel({ firstName, lastName, username, email, password });
        await user.save({ session });

        const profile = new profileModel({ userId: user._id })
        const accControl = new accControlModel({ userId: user._id })
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

        res.status(200).json({ message: "data saved to mongo db", body: { email: user.email } })
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        console.log(err)
        res.status(500).json({ message: "server error" })
    }
}


const OtpVerification = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Incorrect Email" });
        }

        const verifyUser = await verificationModel.findOne({ userId: user._id }).select('+otp');

        if (!verifyUser) {
            return res.status(404).json({ message: "User has no verification record" });
        }

        if (verifyUser.otpBlockedUntil && verifyUser.otpBlockedUntil > new Date()) {
            const remaining = Math.ceil((verifyUser.otpBlockedUntil - new Date()) / 60000);
            return res.status(403).json({ message: `Too many failed attempts. Try again in ${remaining} minutes.` });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (verifyUser.otpExpiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        if (verifyUser.otp !== Number(otp)) {
            verifyUser.otpRequestCount = (verifyUser.otpRequestCount || 0) + 1;

            if (verifyUser.otpRequestCount >= 3) {
                verifyUser.otpBlockedUntil = new Date(Date.now() + 15 * 60 * 1000);
                await verifyUser.save();
                return res.status(403).json({ message: "Too many failed attempts. You are blocked for 15 minutes." });
            }

            await verifyUser.save();
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        user.isVerified = true;
        await user.save();

        await verificationModel.deleteOne({ _id: verifyUser._id });

        return res.status(200).json({ message: "User verified successfully" });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};



const resendOtp = async (req, res) => {
    const { email } = req.body;
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const verifyUser = await verificationModel.findOne({ userId: user._id });

        if (!verifyUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        if (verifyUser.otpBlockedUntil && verifyUser.otpBlockedUntil > new Date()) {
            const minutes = Math.ceil((verifyUser.otpBlockedUntil - new Date()) / 60000);
            return res.status(429).json({ message: `Too many attempts. Try again in ${minutes} minutes.` });
        }

        verifyUser.otpRequestCount = (verifyUser.otpRequestCount || 0) + 1;
        if (verifyUser.otpRequestCount >= 3) {
            verifyUser.otpBlockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            verifyUser.otpRequestCount = 0;
        }

        verifyUser.otp = otp;
        verifyUser.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await verifyUser.save();

        const emailSent = await verifyEmail(email, otp);
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
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (!user.isVerified) {
            return res.status(404).json({ message: "user is not verified" });
        }

        let metadata = await metaModel.findOne({ userId: user._id });

        if (metadata.lockUntil && metadata.lockUntil > Date.now()) {
            return res.status(403).json({ message: "Account temporarily locked. Try again later." });
        }

        if (user.isLoggedIn) {
            return res.status(404).json({ message: "user already logged in" });
        }

        if (user.password !== password) {
            metadata.loginAttempts += 1;

            if (metadata.loginAttempts >= 5) {
                metadata.lockUntil = Date.now() + 15 * 60 * 1000; 
            }
            await metadata.save();
            return res.status(400).json({ message: "Incorrect password" });
        }

        user.isLoggedIn = true;
        await user.save()

        metadata.loginAttempts = 0;
        metadata.lockUntil = null;
        metadata.lastLoginAt = new Date();
        await metadata.save();


        const accessToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })
        const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '1d' })

        return res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000,
        })
            .header('authorization', accessToken)
            .status(200).json({ message: "User logged in successfully!", user: user });
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
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isLoggedIn) {
            return res.status(400).json({ message: "User is already logged out" });
        }

        user.isLoggedIn = false;
        await user.save();

        return res.clearCookie("refreshToken")
            .status(200)
            .json({ message: "User logged out successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = logout;

module.exports = { signup, login, refreshToken, OtpVerification, resendOtp, logout }