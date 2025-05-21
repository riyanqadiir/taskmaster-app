const mongoose = require("mongoose")
const { Schema, model } = mongoose

const userSchema = Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    },
})

const userModel = model("User", userSchema)
module.exports = userModel;