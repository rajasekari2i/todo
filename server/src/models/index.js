const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    ...(dbConfig.dialectOptions && { dialectOptions: dbConfig.dialectOptions }),
    ...(dbConfig.pool && { pool: dbConfig.pool })
  }
);

// Import models
const User = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Todo = require('./Todo')(sequelize);
const Tag = require('./Tag')(sequelize);
const TodoTag = require('./TodoTag')(sequelize);
const Notification = require('./Notification')(sequelize);

// Define associations
User.hasMany(Category, { foreignKey: 'userId', as: 'categories' });
Category.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Todo, { foreignKey: 'userId', as: 'todos' });
Todo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Category.hasMany(Todo, { foreignKey: 'categoryId', as: 'todos' });
Todo.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

User.hasMany(Tag, { foreignKey: 'userId', as: 'tags' });
Tag.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Todo.belongsToMany(Tag, { through: TodoTag, foreignKey: 'todoId', as: 'tags' });
Tag.belongsToMany(Todo, { through: TodoTag, foreignKey: 'tagId', as: 'todos' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Category,
  Todo,
  Tag,
  TodoTag,
  Notification
};
