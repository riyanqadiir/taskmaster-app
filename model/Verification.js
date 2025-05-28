const { Schema, model, Types } = require("mongoose");
const bcrypt = require("bcrypt");

const verificationSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    otp: {
        type: String,
        select: false,
    },
    isVerified: {
        type: Boolean,
        default: false
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
    },
    status: {
        type: String,
        enum: ["signup"], 
        default: "signup"
    }
}, { timestamps: true });

verificationSchema.pre("save", async function (next) {
    if (!this.isModified("otp")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        next();
    } catch (err) {
        next(err);
    }
});

verificationSchema.methods.compareOtp = async function (candidateOtp) {
    return await bcrypt.compare(candidateOtp, this.otp);
};

module.exports = model("Verification", verificationSchema);
