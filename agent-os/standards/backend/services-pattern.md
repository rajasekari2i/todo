# Backend Services Pattern

Services live in `server/src/services/` and handle non-request logic.

## IO Passing

- Socket.io instance passed as parameter to service functions
- Also available via `app.set('io', io)` in Express routes
- Services should accept `io` as a parameter, not import it globally

## Error Isolation

- Email failures are caught and logged, never propagated
- In-app notifications still work even if email fails
- Cron job errors logged to console, don't crash the process

```javascript
try {
  await sendReminderEmail(user, todo);
} catch (emailError) {
  console.error('Failed to send email:', emailError);
  // Don't re-throw — in-app notification already sent
}
```

## Module-Level State

- Socket connections tracked in module-scoped `Map<userId, Set<socketId>>`
- Email transporter uses singleton pattern (created once, reused)
- User rooms: `user:${userId}` for targeted socket emissions

## Cron Jobs

- Reminder service runs every minute (`* * * * *`)
- Uses time-window queries (+-5 minutes) to avoid missing exact timestamps
- Checks for duplicate notifications before creating new ones
