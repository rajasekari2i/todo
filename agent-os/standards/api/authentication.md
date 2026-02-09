# Authentication

JWT Bearer token authentication via `authenticate` middleware.

## Middleware Setup

```javascript
// All protected routes use authenticate middleware
router.get('/', authenticate, controller.getAll);
```

## What authenticate Provides

- `req.userId` - User's ID (used for query scoping)
- `req.user` - Full Sequelize User instance (used when name/email is needed)

Both are set on every authenticated request. Use `req.userId` for queries, `req.user` when you need user details.

## Token Format

- Header: `Authorization: Bearer <token>`
- Payload contains `userId`
- Secret: `process.env.JWT_SECRET`

## Error Responses

- Missing/malformed header -> `401 { error: 'Authentication required' }`
- Invalid token -> `401 { error: 'Invalid token' }`
- Expired token -> `401 { error: 'Token expired' }`
- User not found -> `401 { error: 'User not found' }`
