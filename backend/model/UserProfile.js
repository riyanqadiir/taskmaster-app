const { Schema, model, models, Types } = require("mongoose");

const userProfileSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    address: { type: String },
    phone: { type: String },
    bio: { type: String },
    interests: [{ type: String }],
    avatarUrl:{type: String},
    socialLinks: {
        facebook: { type: String },
        twitter: { type: String },
        linkedin: { type: String },
        github: { type: String },
        website: { type: String }
    }
}, { timestamps: true });

module.exports = models.UserProfile || model("UserProfile", userProfileSchema);
