import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'

export function useTodos(filters = {}) {
  const queryClient = useQueryClient()
  const queryKey = ['todos', filters]

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      const response = await api.get(`/todos?${params}`)
      return response.data.todos
    }
  })

  const createMutation = useMutation({
    mutationFn: (todoData) => api.post('/todos', todoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo created')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create todo')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/todos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo updated')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update todo')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/todos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success('Todo deleted')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete todo')
    }
  })

  const toggleCompleteMutation = useMutation({
    mutationFn: (id) => api.patch(`/todos/${id}/complete`),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      const isCompleted = response.data.todo.isCompleted
      toast.success(isCompleted ? 'Todo completed' : 'Todo marked as pending')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to update todo')
    }
  })

  return {
    todos: data || [],
    isLoading,
    error,
    createTodo: createMutation.mutate,
    updateTodo: updateMutation.mutate,
    deleteTodo: deleteMutation.mutate,
    toggleComplete: toggleCompleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
}
