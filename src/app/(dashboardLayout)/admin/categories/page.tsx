'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

type Category = { id: string; name: string }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)

  function load() {
    setLoading(true)
    apiFetch<{ data: Category[] }>('/categories')
      .then((r) => setCategories(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    try {
      await apiFetch('/categories', { method: 'POST', body: JSON.stringify({ name: newName.trim() }) })
      toast.success('Category added!')
      setNewName('')
      load()
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to add category')
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/categories/${id}`, { method: 'DELETE' })
      toast.success('Category deleted')
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to delete category')
    }
  }

  return (
    <div className='max-w-lg space-y-6'>
      <h1 className='text-2xl font-bold'>Manage Categories</h1>

      {/* Add form */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Add Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className='flex gap-2'>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder='e.g. Mathematics'
            />
            <Button type='submit' disabled={adding}>
              {adding ? 'Adding…' : 'Add'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Category list */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className='text-sm text-muted-foreground'>Loading…</p>
          ) : categories.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No categories yet.</p>
          ) : (
            <ul className='divide-y'>
              {categories.map((c) => (
                <li key={c.id} className='flex items-center justify-between py-2.5'>
                  <span className='text-sm font-medium'>{c.name}</span>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-7 w-7 text-muted-foreground hover:text-destructive'
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash2 className='h-3.5 w-3.5' />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
