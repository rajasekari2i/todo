import { useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useCategories } from '../hooks/useCategories'
import { useTags } from '../hooks/useTags'
import TodoItem from '../components/TodoItem'
import TodoForm from '../components/TodoForm'
import TodoFilters from '../components/TodoFilters'
import { PlusIcon } from '@heroicons/react/24/outline'

function TodoList() {
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [filters, setFilters] = useState({})

  const { todos, isLoading, createTodo, updateTodo, deleteTodo, toggleComplete } = useTodos(filters)
  const { categories } = useCategories()
  const { tags } = useTags()

  const handleCreate = (data) => {
    createTodo(data)
    setShowForm(false)
  }

  const handleUpdate = (data) => {
    updateTodo({ id: editingTodo.id, ...data })
    setEditingTodo(null)
    setShowForm(false)
  }

  const handleEdit = (todo) => {
    setEditingTodo(todo)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTodo(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="mt-14 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Todo
        </button>
      </div>

      <TodoFilters
        filters={filters}
        setFilters={setFilters}
        categories={categories}
      />

      {todos.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No todos found</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Create your first todo
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleComplete(todo.id)}
              onEdit={() => handleEdit(todo)}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TodoForm
          todo={editingTodo}
          categories={categories}
          tags={tags}
          onSubmit={editingTodo ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}

export default TodoList
