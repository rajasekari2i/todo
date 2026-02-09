# Sequelize Model Pattern

## Factory Function Export

All models export a factory function:

```javascript
module.exports = (sequelize) => {
  const Todo = sequelize.define('Todo', { ... }, { ... });
  return Todo;
};
```

Models are instantiated in `models/index.js` which passes the sequelize instance.

## Column Naming

- Model attributes: camelCase (`userId`, `dueDate`, `isCompleted`)
- Database columns: snake_case via explicit `field` property (`user_id`, `due_date`)
- Always specify `field` for multi-word column names

## Timestamps

- `createdAt` mapped to `created_at` — always enabled
- `updatedAt` — enabled for entities that get edited (Todo, User)
- `updatedAt: false` — for entities that are created/deleted but rarely edited (Category, Tag, Notification)

## Validation

- Use Sequelize `validate` property for model-level validation
- Example: `notEmpty`, `isEmail`, regex patterns for colors

## Hooks for Business Logic

- Password hashing in User model's `beforeCreate`/`beforeUpdate` hooks
- Override `toJSON()` to strip sensitive fields (e.g. `passwordHash`)

## Foreign Keys

Always specify explicitly:
```javascript
userId: {
  type: DataTypes.INTEGER,
  field: 'user_id',
  references: { model: 'users', key: 'id' }
}
```
