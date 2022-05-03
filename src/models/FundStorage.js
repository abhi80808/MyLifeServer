const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterModel = require('./Counter');

const FundStorageSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["bank", "wallet"],
        required: true
    },
    balance: {
        type: Number, 
        required: true
    }
}, {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

FundStorageSchema.pre('save', async function() {
    // Don't increment if this is NOT a newly created document
    if(!this.isNew) return;

    const id = await CounterModel.increment('FundStorage');
    this.id = id;
});

FundStorageSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj;
   }

module.exports = mongoose.model("FundStorage", FundStorageSchema);