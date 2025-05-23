const { Schema, model, Types } = require("mongoose");

const verificationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        select: false,
        minlength: 6,
        maxlength: 6
    },
    otpExpiresAt: {
        type: Date
    },
    otpRequestCount: {
        type: Number,
        default: 0
    },
    otpBlockedUntil: {
        type: Date
    }
}, { timestamps: true });

module.exports = model("Verification", verificationSchema);
