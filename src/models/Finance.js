const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterModel = require('./counters/FinanceCounter');

const FundSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    funds: [{
        type: Schema.Types.ObjectId,
        ref: 'FundStorage'
    }]
}, {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

FundSchema.pre('save', async function() {
    // Don't increment if this is NOT a newly created document
    if(!this.isNew) return;

    const id = await CounterModel.increment('entity');
    this.id = id;
});

FundSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
   }

module.exports = mongoose.model("Fund", FundSchema);