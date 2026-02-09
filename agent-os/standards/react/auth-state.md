# Auth State Management

Authentication uses React Context (`AuthContext`) + localStorage.

## Architecture

- `AuthContext` provides: `user`, `login()`, `register()`, `logout()`, `isAuthenticated`
- Token stored in `localStorage` under key `'token'`
- Axios interceptor auto-attaches `Authorization: Bearer <token>` header
- On 401 response, interceptor auto-clears token and redirects to login

## Login Flow

```javascript
const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem('token', data.token)
  setUser(data.user)
}
```

## App Initialization

- On mount, `AuthContext` checks for existing token in localStorage
- Calls `GET /api/auth/me` to validate token and load user
- Shows loading spinner until auth check completes

## Protected Routes

- Use `isAuthenticated` from context to conditionally render routes
- Unauthenticated users redirect to `/login`
