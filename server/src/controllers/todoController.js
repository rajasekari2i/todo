const { Op } = require('sequelize');
const { Todo, Category, Tag, TodoTag } = require('../models');

const getAllTodos = async (req, res, next) => {
  try {
    const { status, priority, categoryId, search, sortBy = 'created_at', order = 'DESC' } = req.query;

    // Map camelCase field names to snake_case column names for sorting
    const sortFieldMap = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      dueDate: 'due_date',
      completedAt: 'completed_at'
    };
    const actualSortField = sortFieldMap[sortBy] || sortBy;

    const where = { userId: req.userId };

    if (status === 'completed') {
      where.isCompleted = true;
    } else if (status === 'pending') {
      where.isCompleted = false;
    }

    if (priority) {
      where.priority = priority;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const todos = await Todo.findAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'color'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ],
      order: [[actualSortField, order]]
    });

    res.json({ todos });
  } catch (error) {
    next(error);
  }
};

const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      where: { id: req.params.id, userId: req.userId },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'color'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ todo });
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, reminderAt, categoryId, tagIds } = req.body;

    const todo = await Todo.create({
      userId: req.userId,
      title,
      description,
      priority,
      dueDate,
      reminderAt,
      categoryId
    });

    if (tagIds && tagIds.length > 0) {
      const tags = await Tag.findAll({
        where: { id: tagIds, userId: req.userId }
      });
      await todo.setTags(tags);
    }

    const createdTodo = await Todo.findByPk(todo.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'color'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });

    res.status(201).json({ message: 'Todo created', todo: createdTodo });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, reminderAt, categoryId, tagIds } = req.body;

    const todo = await Todo.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.update({
      title: title ?? todo.title,
      description: description ?? todo.description,
      priority: priority ?? todo.priority,
      dueDate: dueDate ?? todo.dueDate,
      reminderAt: reminderAt ?? todo.reminderAt,
      categoryId: categoryId !== undefined ? categoryId : todo.categoryId
    });

    if (tagIds !== undefined) {
      const tags = await Tag.findAll({
        where: { id: tagIds, userId: req.userId }
      });
      await todo.setTags(tags);
    }

    const updatedTodo = await Todo.findByPk(todo.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'color'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });

    res.json({ message: 'Todo updated', todo: updatedTodo });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.destroy();

    res.json({ message: 'Todo deleted' });
  } catch (error) {
    next(error);
  }
};

const toggleComplete = async (req, res, next) => {
  try {
    const todo = await Todo.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const isCompleted = !todo.isCompleted;
    await todo.update({
      isCompleted,
      completedAt: isCompleted ? new Date() : null
    });

    const updatedTodo = await Todo.findByPk(todo.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'color'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });

    res.json({
      message: `Todo marked as ${isCompleted ? 'completed' : 'pending'}`,
      todo: updatedTodo
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleComplete
};
