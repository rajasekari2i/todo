const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TodoTag = sequelize.define('TodoTag', {
    todoId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'todo_id',
      references: {
        model: 'todos',
        key: 'id'
      }
    },
    tagId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'tag_id',
      references: {
        model: 'tags',
        key: 'id'
      }
    }
  }, {
    tableName: 'todo_tags',
    timestamps: false
  });

  return TodoTag;
};
