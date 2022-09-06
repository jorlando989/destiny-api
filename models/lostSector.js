const mongoose = require('mongoose');
const { Schema } = mongoose;

const lostSectorSchema = new Schema({
    name: String,
    index: Number,
    isActive: Boolean
});

mongoose.model('lostSector', lostSectorSchema, 's18lostSectors');
