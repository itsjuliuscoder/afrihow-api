const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema({
    title: { type: String, unique: true, required: true },
    story_img: { type: String, required: true },
    details: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }
});

module.exports = mongoose.model('Story', storySchema);