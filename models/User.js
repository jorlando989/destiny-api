const mongoose = require('mongoose');
const { Schema } = mongoose;
const ProfileSchema = require('./Profile');

const userSchema = new Schema({
    accessToken: Object,
    membershipID: String,
    profiles: [ProfileSchema]
});

mongoose.model('users', userSchema);
