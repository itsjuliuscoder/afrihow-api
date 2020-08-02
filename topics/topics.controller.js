const express = require('express');
const router = express.Router();
const topicService = require('./topic.service');

// routes
router.post('/create', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function register(req, res, next) {
    topicService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    topicService.getAll()
        .then(topics => res.json(topics))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    topicService.getById(req.topic.sub)
        .then(topic => topic ? res.json(topic) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    topicService.getById(req.params.id)
        .then(topic => topic ? res.json(topic) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    topicService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    topicService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}