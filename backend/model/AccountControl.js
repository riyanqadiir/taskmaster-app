const { Schema, model, Types } = require("mongoose");

const accountControlSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
    status: {
        type: String,
        enum: ['active', 'pending', 'blocked', 'limited'],
        default: 'pending'
    },
    statusReason: { type: String, default: null }
}, { timestamps: true });

module.exports = model("AccountControl", accountControlSchema);
