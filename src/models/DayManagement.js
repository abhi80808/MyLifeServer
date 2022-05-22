const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterModel = require('./Counter');

const DayManagementSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    dailyTasks: [{
        type: Schema.Types.ObjectId,
        ref: 'DailyTask'
    }]
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

DayManagementSchema.pre('save', async function () {
    // Don't increment if this is NOT a newly created document
    if (!this.isNew) return;

    const id = await CounterModel.increment('DayManagement');
    this.id = id;
});

DayManagementSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
}

module.exports = mongoose.model("DayManagement", DayManagementSchema);