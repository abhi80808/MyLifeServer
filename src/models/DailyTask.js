const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterModel = require('./Counter');

const DailyTaskSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    dayManagementId: {
        type: Schema.Types.ObjectId,
        ref: "DayManagements",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    tasks: [
        {
            task: {
                type: String,
                required: true
            },
            sNo: {
                type: Number
            },
            completionStatus: {
                type: Boolean,
                default: false
            },
            remarks: {
                type: String,
                default: ""
            }
        }
    ]
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

DailyTaskSchema.pre('save', async function () {
    // Don't increment if this is NOT a newly created document
    if (!this.isNew) return;

    const id = await CounterModel.increment('DailyTask');
    this.id = id;
});

DailyTaskSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
}

module.exports = mongoose.model("DailyTask", DailyTaskSchema);