const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const Story = db.Story;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Story.find();
}

async function getById(id) {
    return await Story.findById(id);
}

async function create(storyParam) {
    // validate
    if (await Story.findOne({ title: storyParam.title })) {
        throw 'title "' + storyParam.title + '" already exist';
    }

    const story = new Story(storyParam);

    // save story
    await story.save();
}

async function update(id, storyParam) {
    const story = await Story.findById(id);

    // validate
    if (!story) throw 'Story not found';
    if (story.title !== storyParam.title && await Story.findOne({ title: storyParam.title })) {
        throw 'title "' + storyParam.title + '" is already taken';
    }

    // copy storyParam properties to user
    Object.assign(story, storyParam);

    await story.save();
}

async function _delete(id) {
    await Story.findByIdAndRemove(id);
}