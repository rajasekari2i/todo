# React Component Patterns

## Component Structure

- Functional components only, no class components
- Named function declarations: `function TodoItem() { ... }`
- Default export at bottom: `export default TodoItem`
- No TypeScript — plain JSX

## Forms

- All forms use controlled components with `useState`
- Form state as a single object: `const [formData, setFormData] = useState({ ... })`
- Updates via spread: `setFormData({ ...formData, field: value })`
- Submit handlers prevent default and call mutation hooks

## Styling

- TailwindCSS utility classes for all styling
- Custom `@apply` classes: `card`, `btn-primary`, `btn-secondary`, `input`, `label`
- Use these custom classes instead of repeating utility combinations

## UI Libraries

- Modals: `@headlessui/react` `Dialog` component — always
- Icons: `@heroicons/react/24/outline` — use outline variant
- Toasts: `react-hot-toast` — `toast.success()` / `toast.error()`

## Loading States

```jsx
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
    </div>
  )
}
```

## Empty States

Show a centered message with a CTA button when lists are empty.
