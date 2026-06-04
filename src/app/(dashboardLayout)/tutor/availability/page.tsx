'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'
import { apiFetch } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const HOURS = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`)

type Slot = { day: string; time: string }

export default function TutorAvailabilityPage() {
  const { user } = useAuth()
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    apiFetch<{ data: any[] }>('/api/tutors')
      .then((res) => {
        const myProfile = res.data?.find((t) => t.user?.email === user.email)
        if (myProfile && myProfile.availability) {
          const dayMap: Record<string, string> = {
            MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday', FRI: 'Friday', SAT: 'Saturday', SUN: 'Sunday'
          }
          const loadedSlots = myProfile.availability.map((av: any) => {
            const start = new Date(av.startTime)
            const h = start.getUTCHours().toString().padStart(2, '0')
            return {
              day: dayMap[av.day] || av.day,
              time: `${h}:00`
            }
          })
          setSlots(loadedSlots)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  function toggleSlot(day: string, time: string) {
    const key = `${day}:${time}`
    setSlots((prev) => {
      const exists = prev.some((s) => `${s.day}:${s.time}` === key)
      return exists ? prev.filter((s) => `${s.day}:${s.time}` !== key) : [...prev, { day, time }]
    })
  }

  function isSelected(day: string, time: string) {
    return slots.some((s) => s.day === day && s.time === time)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const dayMap: Record<string, string> = {
        'Monday': 'MON',
        'Tuesday': 'TUE',
        'Wednesday': 'WED',
        'Thursday': 'THU',
        'Friday': 'FRI',
        'Saturday': 'SAT',
        'Sunday': 'SUN'
      }

      const availabilities = slots.map((slot) => {
        const [hours, minutes] = slot.time.split(':')
        // Use a fixed date to prevent timezone shift issues on the backend 
        // if only time is relevant
        const startDate = new Date('2024-01-01T00:00:00Z')
        startDate.setUTCHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)
        
        const endDate = new Date(startDate)
        endDate.setUTCHours(startDate.getUTCHours() + 1)

        return {
          day: dayMap[slot.day],
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        }
      })

      await apiFetch('/api/tutor/availability', { 
        method: 'PUT', 
        body: JSON.stringify({ availabilities }) 
      })
      toast.success('Availability saved!')
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save availability')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='max-w-6xl space-y-8 py-4 animate-fade-in'>
      <div className='flex flex-col gap-1.5'>
        <h1 className='text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent'>Set Availability</h1>
        <p className='text-sm text-slate-400 font-light'>Manage your weekly slots. Click on any block to toggle availability, then save your changes.</p>
      </div>

      <Card className='border-slate-800 bg-slate-950/40 backdrop-blur-md shadow-2xl'>
        <CardHeader className='border-b border-slate-900 pb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
            <div>
              <CardTitle className='text-lg font-bold text-white'>Weekly Schedule</CardTitle>
              <CardDescription className='text-slate-400 text-xs font-light mt-0.5'>Select the hours you are open for tutoring sessions.</CardDescription>
            </div>
            <div className='flex items-center gap-2.5 bg-slate-900/60 border border-slate-800 px-4 py-2 rounded-xl'>
              <span className='w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse' />
              <span className='text-xs font-semibold text-slate-350'>{slots.length} active slot(s)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className='pt-6 overflow-x-auto'>
          {loading ? (
            <div className='flex flex-col items-center justify-center py-20 gap-3'>
              <div className='w-8 h-8 rounded-full border-2 border-slate-800 border-t-emerald-500 animate-spin' />
              <p className='text-sm text-slate-450 animate-pulse font-light'>
                Retrieving schedule...
              </p>
            </div>
          ) : (
            <table className='text-xs border-collapse w-full min-w-[700px]'>
              <thead>
                <tr>
                  <th className='p-3 text-left text-slate-400 font-semibold w-24 border-b border-slate-900'>Time</th>
                  {DAYS.map((d) => (
                    <th key={d} className='p-3 text-center font-bold text-slate-300 border-b border-slate-900'>{d.slice(0, 3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-900/40'>
                {HOURS.map((time) => (
                  <tr key={time} className='hover:bg-slate-900/10 transition-colors duration-150'>
                    <td className='p-3 font-medium text-slate-450 border-r border-slate-900/40'>{time}</td>
                    {DAYS.map((day) => {
                      const selected = isSelected(day, time)
                      return (
                        <td key={day} className='p-1.5 text-center'>
                          <button
                            onClick={() => toggleSlot(day, time)}
                            className={`w-full h-9 rounded-lg text-[11px] font-bold transition-all duration-200 border flex items-center justify-center ${
                              selected
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-0 shadow-md shadow-emerald-500/10 scale-[1.02]'
                                : 'border-slate-800 hover:border-slate-700 bg-slate-900/20 hover:bg-slate-900/50 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {selected ? '✓' : ''}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className='flex items-center gap-4 pt-2'>
        <Button 
          onClick={handleSave} 
          disabled={saving || loading}
          className='bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-6 py-5 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-emerald-500/15 disabled:opacity-50 disabled:pointer-events-none border-0'
        >
          {saving ? 'Saving changes…' : 'Save Availability'}
        </Button>
      </div>
    </div>
  )
}
