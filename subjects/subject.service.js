const config = require('config.json');
const db = require('_helpers/db');
const Subject = db.Subject;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Subject.find();
}

async function getById(id) {
    return await Subject.findById(id);
}

async function create(subjectParam) {
    // validate
    if (await Subject.findOne({ title: subjectParam.title })) {
        throw 'title "' + subjectParam.title + '" is already taken';
    }

    const subject = new Subject(subjectParam);

    // save subject
    await subject.save();
}

async function update(id, subjectParam) {
    const subject = await Subject.findById(id);

    // validate
    if (!subject) throw 'Subject not found';
    if (subject.title !== subjectParam.title && await Subject.findOne({ title: subjectParam.title })) {
        throw 'title "' + subjectParam.title + '" is already taken';
    }

    // copy subjectParam properties to user
    Object.assign(subject, subjectParam);

    await subject.save();
}

async function _delete(id) {
    await Subject.findByIdAndRemove(id);
}