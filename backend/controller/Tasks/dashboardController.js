const DashboardLayout = require("../../model/UserDashboardLayout");

const updateDashboardLayout = async (req, res) => {
    try {
        const userId = req.user._id;
        const { layout } = req.body;

        if (!Array.isArray(layout)) {
            return res.status(400).json({ message: "Layout must be an array" });
        }

        const userLayout = await DashboardLayout.findOneAndUpdate(
            { userId },
            { layout, updatedAt: Date.now() },
            { new: true, upsert: true }
        );

        res.status(200).json({
            message: "Dashboard layout updated successfully!",
            layout: userLayout.layout,
        });
    } catch (err) {
        console.error("Error updating dashboard layout:", err);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { updateDashboardLayout }