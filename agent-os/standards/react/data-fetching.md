# Data Fetching with React Query

All server state uses React Query via custom hooks in `client/src/hooks/`.

## Hook Structure

```javascript
export function useTodos(filters) {
  const queryClient = useQueryClient()
  const queryKey = ['todos', filters]

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => api.get('/todos', { params: filters }).then(r => r.data),
  })

  const createTodo = useMutation({
    mutationFn: (data) => api.post('/todos', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  })

  return { todos: data?.todos || [], isLoading, createTodo: createTodo.mutate }
}
```

Rules:
- One hook per resource (useTodos, useCategories, useTags, useNotifications)
- Query keys colocated in hook file, not centralized
- Mutations invalidate queries on success via `queryClient.invalidateQueries`
- Return data with safe defaults (`data?.items || []`)
- Expose `mutate` directly, not the mutation object
- Toast notifications for mutation success/error handled in hooks
