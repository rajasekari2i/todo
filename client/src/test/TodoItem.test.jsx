import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TodoItem from '../components/TodoItem'

const mockTodo = {
  id: 1,
  title: 'Test Todo',
  description: 'Test description',
  priority: 'high',
  isCompleted: false,
  dueDate: '2024-12-31T10:00:00Z',
  category: { id: 1, name: 'Work', color: '#6366f1' },
  tags: [{ id: 1, name: 'urgent' }]
}

describe('TodoItem', () => {
  it('renders todo title', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('Test Todo')).toBeInTheDocument()
  })

  it('renders todo description', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('renders category badge', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('Work')).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(screen.getByText('#urgent')).toBeInTheDocument()
  })

  it('calls onToggle when checkbox clicked', () => {
    const onToggle = vi.fn()
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={onToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    const checkbox = screen.getByRole('button', { name: '' })
    fireEvent.click(checkbox)

    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows completed state with line-through', () => {
    const completedTodo = { ...mockTodo, isCompleted: true }
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    const title = screen.getByText('Test Todo')
    expect(title).toHaveClass('line-through')
  })
})
