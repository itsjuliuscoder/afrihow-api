const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    topic_img: { type: String, required: true },
    details: { type: String, required: true },
    subject_id: { type: String, unique: true, required: true },
    createdDate: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Topic', topicSchema);