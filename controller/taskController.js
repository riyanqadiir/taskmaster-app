const getTask = (req, res) => {
    const {user} = req;
    try {
        console.log(user)
        res.status(200).json({ message: "token verified" })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "server error" })
    }
}

module.exports = {getTask}