const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CounterModel = require('./Counter');

const UserSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: {
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    finance: {
        type: Schema.Types.ObjectId,
        ref: 'Finance'
    },
    dayManagement: {
        type: Schema.Types.ObjectId,
        ref: 'DayManagement'
    }
}, {timestamps: {createdAt: 'createdAt', updatedAt: 'updatedAt'}});

UserSchema.pre('save', async function() {
    // Don't increment if this is NOT a newly created document
    if(!this.isNew) return;

    const id = await CounterModel.increment('User');
    this.id = id;
});

UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    delete obj._id;
    delete obj.__v;
    return obj;
   }

module.exports = mongoose.model("User", UserSchema);