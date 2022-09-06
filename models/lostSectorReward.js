const mongoose = require('mongoose');
const { Schema } = mongoose;

const lostSectorRewardSchema = new Schema({
    type: String,
    index: Number,
    isActive: Boolean
});

mongoose.model('lostSectorReward', lostSectorRewardSchema, 'lostSectorRewards');
