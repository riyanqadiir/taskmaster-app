const { Schema, model, Types } = require("mongoose");

const taskSchema = new Schema({
    ownerId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'waiting', 'completed'],//user-facing tracker.
        default: 'not_started'
    },
    priority: {
        type: Number,
        enum: {
            values: [1, 2, 3],
            message: 'Priority must be 1 (High), 2 (Medium), or 3 (Low)'
        },
        default: 3
    },
    tags: {
        type: [String],
        default: []
    },
    archived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes
taskSchema.index({ ownerId: 1 }); // Fast fetch for user-specific tasks
taskSchema.index({ ownerId: 1, archived: 1 });// Composite index for user + archived status
taskSchema.index({ ownerId: 1, isDeleted: 1 });  
taskSchema.index({ dueDate: 1 }); // Sorting/filtering by due date
taskSchema.index({ createdAt: 1 }); // Sorting by creation time
taskSchema.index({ title: "text" }); // Text index for search

module.exports = model("Task", taskSchema);
