const mongoose = require('mongoose');
const { Schema } = mongoose;

const profileSchema = new Schema({
    dateLastPlayed: String,
    membershipType: Number,
    membershipId: String,
    displayName: String,
    bungieGlobalDisplayName: String,
    bungieGlobalDisplayNameCode: Number
});

module.exports = profileSchema;
