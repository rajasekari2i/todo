# Unit Testing

## Test Runners

- **Client (React):** Vitest + React Testing Library
  - Tests in `client/src/test/`
  - Setup file: `client/src/test/setup.js` (mocks localStorage, matchMedia)
  - Run: `npm run test` from `/client`

- **Server (Express):** Jest + Supertest
  - Tests in `server/src/__tests__/`
  - Config: `server/jest.config.js`
  - Run: `npm run test` from `/server`

## Client Test Pattern

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const mockTodo = { id: 1, title: 'Test', ... }

describe('TodoItem', () => {
  it('renders todo title', () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} ... />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

- Mock callbacks with `vi.fn()`
- Use `screen.getByText()`, `screen.getByRole()` for queries
- Test rendering, user interactions, and state changes
- Mock data objects defined at top of test file
