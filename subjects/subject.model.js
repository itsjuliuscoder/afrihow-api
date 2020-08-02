const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    subject_img: { type: String, required: true },
    tags: { type: String, required: true },
    user_id: mongoose.Schema.Types.ObjectId,
    createdDate: { type: Date, default: Date.now },
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
    }
});

module.exports = mongoose.model('Subject', subjectSchema);