const { Schema, model, Types } = require("mongoose");

const userMetadataSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    lastLoginAt: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },

    changePasswordAttempts: { type: Number, default: 0 },        // attempts in current window
    changePasswordWindowStart: { type: Date },                    // when the count window started
    changePasswordBlockedUntil: { type: Date },

}, { timestamps: true });

module.exports = model("UserMetadata", userMetadataSchema);
