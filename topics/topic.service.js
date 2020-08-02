const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Topic = db.Topic;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Topic.find();
}

async function getById(id) {
    return await Topic.findById(id);
}

async function create(topicParam) {
    // validate
    if (await Topic.findOne({ title: topicParam.title })) {
        throw 'Title "' + topicParam.title + '" already exist';
    }

    const topic = new Topic(topicParam);

    // save topic
    await topic.save();
}

async function update(id, topicParam) {
    const topic = await Topic.findById(id);

    // validate
    if (!topic) throw 'Topic not found';
    if (topic.title !== topicParam.title && await Topic.findOne({ title: topicParam.title })) {
        throw 'title "' + topicParam.title + '" already exist';
    }

    // copy topicParam properties to user
    Object.assign(topic, topicParam);

    await topic.save();
}

async function _delete(id) {
    await Topic.findByIdAndRemove(id);
}