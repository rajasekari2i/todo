const express = require('express');
const Joi = require('joi');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

const categorySchema = Joi.object({
  name: Joi.string().max(100).required(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
});

const updateCategorySchema = Joi.object({
  name: Joi.string().max(100).optional(),
  color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
});

router.use(authenticate);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', validate(categorySchema), categoryController.createCategory);
router.put('/:id', validate(updateCategorySchema), categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
