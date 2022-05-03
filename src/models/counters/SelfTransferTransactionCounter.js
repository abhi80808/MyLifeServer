const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
    _id: {
        type: String,
        required: true,
    },
    seq: {
        type: Number,
        default: 0,
    },
});

CounterSchema.static('increment', async function(counterName) {
    const count = await this.findByIdAndUpdate(
        counterName,
        {$inc: {seq: 1}},
        {new: true, upsert: true}
    );
    return count.seq;
});

module.exports = mongoose.model('SelfTransferTransactionCounter', CounterSchema);