# API Controller Pattern

All controllers follow this structure:

```javascript
const action = async (req, res, next) => {
  try {
    // Always scope queries to current user
    const item = await Model.findOne({
      where: { id: req.params.id, userId: req.userId }
    });
    // Return 404 if not found
    if (!item) return res.status(404).json({ error: 'Not found' });

    res.json({ item });
  } catch (error) {
    next(error); // Delegate to errorHandler middleware
  }
};
```

Rules:
- Every query MUST include `userId: req.userId` — no exceptions
- Always wrap in try-catch and call `next(error)` — never handle errors inline
- Return responses as `{ resourceName: data }` (e.g. `{ todos }`, `{ category }`)
- Create responses use `201` with `{ message, resourceName }`
- Delete responses return `{ message }` only
- 404 checks use `findOne` + manual null check, not `findOrFail`
