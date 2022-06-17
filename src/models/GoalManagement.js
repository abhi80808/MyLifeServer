const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterModel = require('./Counter');

const GoalManagementSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    shortTerm: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Goal'
        }
    ],
    midTerm: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Goal'
        }
    ],
    longTerm: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Goal'
        }
    ]
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

GoalManagementSchema.pre('save', async function () {
    // Don't increment if this is NOT a newly created document
    if (!this.isNew) return;

    const id = await CounterModel.increment('GoalManagement');
    this.id = id;
});

GoalManagementSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
}

module.exports = mongoose.model("GoalManagement", GoalManagementSchema);