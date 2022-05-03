const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterModel = require('./counters/SelfTransferLogCounter');

const SelfTransferLog = new Schema({
    id: {
        type: Number,
        unique: true
    },
    log: [
        {
            type: Schema.Types.ObjectId,
            ref: "SelfTransferTransaction"
        }
    ]
}, {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

SelfTransferLog.pre('save', async function() {
    // Don't increment if this is NOT a newly created document
    if(!this.isNew) return;

    const id = await CounterModel.increment('entity');
    this.id = id;
});

SelfTransferLog.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
   }

module.exports = mongoose.model("SelfTransferLog", SelfTransferLog);