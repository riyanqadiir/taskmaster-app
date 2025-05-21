const userModel = require("../model/userModel")
const jwt = require('jsonwebtoken');
const signup = async (req, res) => {
    try {
        console.log(req.body)
        const { fname, lname, username, email, password, } = req.body;
        const findUser = await userModel.findOne({ email: email })
        if (findUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new userModel({ fname, lname, username, email, password });
        await user.save()
        res.status(200).json({ message: "data saved to mongo db", body: user })

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "server error" })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ message: "Incorrect Email" });
        }
        if (user.password !== password) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        user.isLoggedIn = true;

        await user.save()

        const accessToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' })
        const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_SECRET_KEY, { expiresIn: '1d' })


        return res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000,
        })
            .header('authorization', accessToken)
            .status(200).json({ message: "User logged in successfully!", user: user._id });

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "server error" })
    }
}

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

module.exports = { signup, login, refreshToken }