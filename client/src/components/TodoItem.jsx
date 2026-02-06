import { format } from 'date-fns'
import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'

const priorityColors = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.isCompleted

  return (
    <div
      className={`card flex items-start gap-4 ${
        todo.isCompleted ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={onToggle}
        className="mt-1 flex-shrink-0 focus:outline-none"
      >
        {todo.isCompleted ? (
          <CheckCircleSolidIcon className="h-6 w-6 text-green-500" />
        ) : (
          <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-green-500" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className={`font-medium ${
                todo.isCompleted ? 'line-through text-gray-500' : ''
              }`}
            >
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-sm text-gray-500 mt-1">{todo.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {todo.category && (
            <span
              className="px-2 py-1 text-xs rounded-full text-white"
              style={{ backgroundColor: todo.category.color }}
            >
              {todo.category.name}
            </span>
          )}

          {todo.priority && (
            <span
              className={`px-2 py-1 text-xs rounded-full ${priorityColors[todo.priority]}`}
            >
              {todo.priority}
            </span>
          )}

          {todo.tags?.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              #{tag.name}
            </span>
          ))}

          {todo.dueDate && (
            <span
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                isOverdue
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <CalendarIcon className="h-3 w-3" />
              {format(new Date(todo.dueDate), 'MMM d, yyyy')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default TodoItem
