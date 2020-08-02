const express = require('express');
const router = express.Router();
const storyService = require('./story.service');

// routes
router.post('/create', create);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
    storyService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    storyService.getAll()
        .then(stories => res.json(stories))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    storyService.getById(req.story.sub)
        .then(story => story ? res.json(story) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    storyService.getById(req.params.id)
        .then(story => story ? res.json(story) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    storyService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    storyService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}