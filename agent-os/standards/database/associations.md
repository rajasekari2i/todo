# Model Associations

All associations defined in `models/index.js`.

## Convention

- Always define both sides: `hasMany` + `belongsTo` (or `belongsToMany`)
- `as` aliases: plural for hasMany (`'todos'`), singular for belongsTo (`'user'`)
- `onDelete: 'CASCADE'` for owned resources

## Pattern

```javascript
// In models/index.js
User.hasMany(Todo, { foreignKey: 'userId', as: 'todos' });
Todo.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Many-to-many through junction table
Todo.belongsToMany(Tag, { through: TodoTag, foreignKey: 'todoId', as: 'tags' });
Tag.belongsToMany(Todo, { through: TodoTag, foreignKey: 'tagId', as: 'todos' });
```

## Include Pattern in Controllers

```javascript
const todos = await Todo.findAll({
  include: [
    { model: Category, as: 'category' },
    { model: Tag, as: 'tags', through: { attributes: [] } }  // Hide junction table
  ]
});
```

- Use `through: { attributes: [] }` to hide junction table fields in many-to-many
- Use `required: false` for optional associations (left join)
