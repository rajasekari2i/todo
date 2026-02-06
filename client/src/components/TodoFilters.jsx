import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

function TodoFilters({ filters, setFilters, categories }) {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  return (
    <div className="card">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search todos..."
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        <select
          value={filters.status || ''}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="input w-auto"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filters.priority || ''}
          onChange={(e) => updateFilter('priority', e.target.value)}
          className="input w-auto"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={filters.categoryId || ''}
          onChange={(e) => updateFilter('categoryId', e.target.value)}
          className="input w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={filters.sortBy || 'createdAt'}
          onChange={(e) => updateFilter('sortBy', e.target.value)}
          className="input w-auto"
        >
          <option value="createdAt">Sort by Created</option>
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
    </div>
  )
}

export default TodoFilters
