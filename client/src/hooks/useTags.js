import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import toast from 'react-hot-toast'

export function useTags() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await api.get('/tags')
      return response.data.tags
    }
  })

  const createMutation = useMutation({
    mutationFn: (tagData) => api.post('/tags', tagData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag created')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create tag')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tags/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag deleted')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to delete tag')
    }
  })

  return {
    tags: data || [],
    isLoading,
    error,
    createTag: createMutation.mutate,
    deleteTag: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
}
