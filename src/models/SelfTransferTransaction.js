const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterModel = require('./Counter');

const SelfTransferTransaction = new Schema({
    id: {
        type: Number,
        unique: true
    },
    transferFrom: {
        type: Schema.Types.ObjectId,
        ref: 'FundStorage',
        required: true
    },
    transferTo: {
        type: Schema.Types.ObjectId,
        ref: 'FundStorage',
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

SelfTransferTransaction.pre('save', async function() {
    // Don't increment if this is NOT a newly created document
    if(!this.isNew) return;

    const id = await CounterModel.increment('SelfTransferTransaction');
    this.id = id;
});

SelfTransferTransaction.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
   }

module.exports = mongoose.model("SelfTransferTransaction", SelfTransferTransaction);