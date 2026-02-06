const { Tag, Todo } = require('../models');

const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.findAll({
      where: { userId: req.userId },
      include: [{
        model: Todo,
        as: 'todos',
        attributes: ['id'],
        through: { attributes: [] },
        required: false
      }],
      order: [['name', 'ASC']]
    });

    const tagsWithCount = tags.map(tag => ({
      ...tag.toJSON(),
      todoCount: tag.todos?.length || 0,
      todos: undefined
    }));

    res.json({ tags: tagsWithCount });
  } catch (error) {
    next(error);
  }
};

const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existingTag = await Tag.findOne({
      where: { userId: req.userId, name }
    });

    if (existingTag) {
      return res.status(409).json({ error: 'Tag already exists' });
    }

    const tag = await Tag.create({
      userId: req.userId,
      name
    });

    res.status(201).json({ message: 'Tag created', tag });
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findOne({
      where: { id: req.params.id, userId: req.userId }
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    await tag.destroy();

    res.json({ message: 'Tag deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTags,
  createTag,
  deleteTag
};
