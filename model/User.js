const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt")
const crypto = require("crypto");

const userSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpiry: {
        type: Date,
        default: null
    },
    passwordResetCount: {
        type: Number,
        default: 0
    },
    lastPasswordChanged: {
        type: Date,
        default: null
    }
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    this.email = this.email.toLowerCase().trim();
    this.username = this.username.toLowerCase().trim();
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (err) {
        next(err);
    }

});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getResetPasswordToken = async function () {
    const now = Date.now();

    if (!this.resetPasswordExpiry || this.resetPasswordExpiry < now) {
        this.passwordResetCount = 0;
    }
    if (this.passwordResetCount >= 3) {
        throw new Error("Too many reset attempts. Please try again later.");
    }
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpiry = now + 60 * 60 * 1000; 
    this.passwordResetCount += 1;

    return resetToken;
};


module.exports = model("User", userSchema);
