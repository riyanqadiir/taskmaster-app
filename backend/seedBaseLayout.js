const mongoose = require("mongoose");
const DashboardLayout = require("./model/UserDashboardLayout");
require("dotenv").config();

(async () => {
    await mongoose.connect("mongodb://localhost:27017/TaskMaster");

    const baseLayout = [
        { id: "summary", title: "My Tasks Summary", size: 4, position: 0 },
        { id: "trend", title: "Completion Trend", size: 4, position: 1 },
        { id: "status", title: "Status Breakdown", size: 4, position: 2 },
        { id: "deadlines", title: "Upcoming Deadlines",position: 3 },
        { id: "activity", title: "Recent Activity",position: 4 },
    ];

    await DashboardLayout.updateOne(
        { userId: null }, 
        { $set: { baseLayout } },
        { upsert: true }
    );

    console.log("✅ Base layout seeded successfully!");
    process.exit(0);
})();