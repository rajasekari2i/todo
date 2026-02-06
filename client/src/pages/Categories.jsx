import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useTags } from '../hooks/useTags'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Dialog } from '@headlessui/react'

function Categories() {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories()
  const { tags, createTag, deleteTag } = useTags()
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryForm, setCategoryForm] = useState({ name: '', color: '#6366f1' })
  const [newTagName, setNewTagName] = useState('')

  const handleCategorySubmit = (e) => {
    e.preventDefault()
    if (editingCategory) {
      updateCategory({ id: editingCategory.id, ...categoryForm })
    } else {
      createCategory(categoryForm)
    }
    closeCategoryForm()
  }

  const openEditCategory = (category) => {
    setEditingCategory(category)
    setCategoryForm({ name: category.name, color: category.color })
    setShowCategoryForm(true)
  }

  const closeCategoryForm = () => {
    setShowCategoryForm(false)
    setEditingCategory(null)
    setCategoryForm({ name: '', color: '#6366f1' })
  }

  const handleAddTag = (e) => {
    e.preventDefault()
    if (newTagName.trim()) {
      createTag({ name: newTagName.trim() })
      setNewTagName('')
    }
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
      <h1 className="text-2xl font-bold">Categories & Tags</h1>

      {/* Categories Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <button
            onClick={() => setShowCategoryForm(true)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Add Category
          </button>
        </div>

        {categories.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No categories yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-500">
                    ({category.todoCount} todos)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditCategory(category)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags Section */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Tags</h2>

        <form onSubmit={handleAddTag} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name..."
            className="input flex-1"
          />
          <button type="submit" className="btn-primary">
            Add Tag
          </button>
        </form>

        {tags.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tags yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full"
              >
                <span className="text-sm">#{tag.name}</span>
                <span className="text-xs text-gray-500">({tag.todoCount})</span>
                <button
                  onClick={() => deleteTag(tag.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showCategoryForm && (
        <Dialog open={true} onClose={closeCategoryForm} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-sm w-full bg-white rounded-xl shadow-xl p-6">
              <Dialog.Title className="text-lg font-semibold mb-4">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </Dialog.Title>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="label">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="color" className="label">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="color"
                      type="color"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={categoryForm.color}
                      onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                      className="input flex-1"
                      pattern="^#[0-9A-Fa-f]{6}$"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={closeCategoryForm} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCategory ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  )
}

export default Categories
