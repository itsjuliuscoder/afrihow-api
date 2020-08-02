const express = require('express');
const router = express.Router();
const subjectService = require('./subject.service');

// routes
router.post('/authenticate', authenticate);
router.post('/create', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    subjectService.authenticate(req.body)
        .then(subject => subject ? res.json(subject) : res.status(400).json({ message: 'subjectname or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    subjectService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    subjectService.getAll()
        .then(subjects => res.json(subjects))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    subjectService.getById(req.subject.sub)
        .then(subject => subject ? res.json(subject) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    subjectService.getById(req.params.id)
        .then(subject => subject ? res.json(subject) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    subjectService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    subjectService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}