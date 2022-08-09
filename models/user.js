const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    accessToken: Object,
    membershipType: String,
    membershipID: String
});

mongoose.model('users', userSchema);