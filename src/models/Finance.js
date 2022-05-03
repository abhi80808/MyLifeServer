const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterModel = require('./Counter');

const FinanceSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    funds: [{
        type: Schema.Types.ObjectId,
        ref: 'FundStorage'
    }],
    selfTransferLog: {
        type: Schema.Types.ObjectId,
        ref: 'SelfTransferLog'
    }
}, {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

FinanceSchema.pre('save', async function() {
    // Don't increment if this is NOT a newly created document
    if(!this.isNew) return;

    const id = await CounterModel.increment('Finance');
    this.id = id;
});

FinanceSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
   }

module.exports = mongoose.model("Finance", FinanceSchema);