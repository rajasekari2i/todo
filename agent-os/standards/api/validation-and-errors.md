# Validation & Error Handling

## Request Validation

Use Joi schemas in route files, applied via `validate` middleware:

```javascript
router.post('/', authenticate, validate(createSchema), controller.create);
```

- Schemas defined in route files, not controllers
- `validate` middleware strips unknown fields (`stripUnknown: true`) as a security measure
- `validate` replaces `req.body` with the cleaned value
- Use `abortEarly: false` to return all validation errors at once

## Error Response Format

All errors follow this contract:

```json
{ "error": "Human-readable message" }
{ "error": "Validation error", "details": [{ "field": "name", "message": "..." }] }
```

## Error Handler Middleware

The centralized `errorHandler` handles:
- `SequelizeValidationError` -> 400 with field details
- `SequelizeUniqueConstraintError` -> 409 with field name
- Joi errors (`err.isJoi`) -> 400 with field details
- JWT errors -> handled in auth middleware (401)
- Default -> 500 with message (stack trace only in development)

## Status Code Convention

- `400` - Validation errors
- `401` - Auth required / invalid token / expired token
- `404` - Resource not found
- `409` - Duplicate/conflict (unique constraint, tag exists)
- `500` - Unexpected server error
