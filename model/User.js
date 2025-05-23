const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt")

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
    isVerified: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false,
    },
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

module.exports = model("User", userSchema);
