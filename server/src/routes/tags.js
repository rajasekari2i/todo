const express = require('express');
const Joi = require('joi');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const tagController = require('../controllers/tagController');

const router = express.Router();

const tagSchema = Joi.object({
  name: Joi.string().max(50).required()
});

router.use(authenticate);

router.get('/', tagController.getAllTags);
router.post('/', validate(tagSchema), tagController.createTag);
router.delete('/:id', tagController.deleteTag);

module.exports = router;
