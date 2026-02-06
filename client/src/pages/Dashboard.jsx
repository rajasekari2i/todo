import { Link } from 'react-router-dom'
import { useTodos } from '../hooks/useTodos'
import { useCategories } from '../hooks/useCategories'
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

function Dashboard() {
  const { todos, isLoading } = useTodos()
  const { categories } = useCategories()

  const completedCount = todos.filter((t) => t.isCompleted).length
  const pendingCount = todos.filter((t) => !t.isCompleted).length
  const overdueCount = todos.filter(
    (t) => !t.isCompleted && t.dueDate && new Date(t.dueDate) < new Date()
  ).length

  const upcomingTodos = todos
    .filter((t) => !t.isCompleted && t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="mt-14 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircleIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <ClockIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{overdueCount}</p>
            <p className="text-sm text-gray-500">Overdue</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <TagIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{categories.length}</p>
            <p className="text-sm text-gray-500">Categories</p>
          </div>
        </div>
      </div>

      {/* Upcoming Todos */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upcoming Todos</h2>
          <Link to="/todos" className="text-primary-600 hover:text-primary-700 text-sm">
            View all
          </Link>
        </div>

        {upcomingTodos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No upcoming todos with due dates
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {todo.category && (
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: todo.category.color }}
                    />
                  )}
                  <span>{todo.title}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link to="/todos" className="btn-primary">
            Add New Todo
          </Link>
          <Link to="/categories" className="btn-secondary">
            Manage Categories
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
