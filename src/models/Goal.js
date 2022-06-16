const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterModel = require('./Counter');

const GoalSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    goalManagementId: {
        type: Schema.Types.ObjectId,
        ref: "GoalManagement",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    completionStatus: {
        type: Boolean,
        required: true,
        default: false
    },
    remarks: {
        type: String,
        default: ""
    }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

GoalSchema.pre('save', async function () {
    // Don't increment if this is NOT a newly created document
    if (!this.isNew) return;

    const id = await CounterModel.increment('Goal');
    this.id = id;
});

GoalSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
}

module.exports = mongoose.model("Goal", GoalSchema);