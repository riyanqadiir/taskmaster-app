const { Schema, model, Types } = require("mongoose");

const widgetSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String },
    size: { type: Number, default: 4 },
    position: { type: Number, default: 0 },
});

const dashboardLayoutSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User", unique: true },
    layout: [widgetSchema],           
    baseLayout: [widgetSchema],       
    updatedAt: { type: Date, default: Date.now },
});

dashboardLayoutSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = model("DashboardLayout", dashboardLayoutSchema);