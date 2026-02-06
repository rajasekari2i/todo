const express = require('express');
const Joi = require('joi');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const todoController = require('../controllers/todoController');

const router = express.Router();

const createTodoSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().allow('').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().iso().allow(null).optional(),
  reminderAt: Joi.date().iso().allow(null).optional(),
  categoryId: Joi.number().integer().allow(null).optional(),
  tagIds: Joi.array().items(Joi.number().integer()).optional()
});

const updateTodoSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  description: Joi.string().allow('').optional(),
  priority: Joi.string().valid('low', 'medium', 'high').optional(),
  dueDate: Joi.date().iso().allow(null).optional(),
  reminderAt: Joi.date().iso().allow(null).optional(),
  categoryId: Joi.number().integer().allow(null).optional(),
  tagIds: Joi.array().items(Joi.number().integer()).optional()
});

router.use(authenticate);

router.get('/', todoController.getAllTodos);
router.get('/:id', todoController.getTodoById);
router.post('/', validate(createTodoSchema), todoController.createTodo);
router.put('/:id', validate(updateTodoSchema), todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.patch('/:id/complete', todoController.toggleComplete);

module.exports = router;
