const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    firstName: String,
    middleName: String,
    lastName: String,
});

module.exports = mongoose.model("User", UserSchema);