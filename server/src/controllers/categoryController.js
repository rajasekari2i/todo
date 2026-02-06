const { Category, Todo } = require('../models');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.userId },
      include: [{
        model: Todo,
        as: 'todos',
        attributes: ['id'],
        required: false
      }],
      order: [['name', 'ASC']]
    });

    const categoriesWithCount = categories.map(cat => ({
      ...cat.toJSON(),
      todoCount: cat.todos?.length || 0,
      todos: undefined
    }));

    res.json({ categories: categoriesWithCount });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;

    const category = await Category.create({
      userId: req.userId,
      name,
      color
    });

    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, color } = req.body;

    const category = await Category.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.update({
      name: name ?? category.name,
      color: color ?? category.color
    });

    res.json({ message: 'Category updated', category });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.destroy();

    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
