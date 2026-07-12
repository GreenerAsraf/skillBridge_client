'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Save, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { apiFetch } from '@/lib/api'

type DayEnum = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN'
const DAYS: { value: DayEnum; label: string }[] = [
  { value: 'MON', label: 'Monday' },
  { value: 'TUE', label: 'Tuesday' },
  { value: 'WED', label: 'Wednesday' },
  { value: 'THU', label: 'Thursday' },
  { value: 'FRI', label: 'Friday' },
  { value: 'SAT', label: 'Saturday' },
  { value: 'SUN', label: 'Sunday' },
]

type TimeSlot = {
  day: DayEnum
  startTime: string // "HH:mm"
  endTime: string // "HH:mm"
}

// Helper to convert Prisma DateTime to "HH:mm"
function extractTime(isoString: string) {
  const date = new Date(isoString)
  const h = date.getUTCHours().toString().padStart(2, '0')
  const m = date.getUTCMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

// Helper to convert "HH:mm" to a dummy ISO string for Prisma DateTime
function buildIsoTime(timeStr: string) {
  const [h, m] = timeStr.split(':')
  // Using 1970-01-01 as the dummy date base for time slots
  return `1970-01-01T${h.padStart(2, '0')}:${m.padStart(2, '0')}:00.000Z`
}

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Fetch current profile to get existing availability
    apiFetch<{ data: { availability?: Array<{ day: DayEnum; startTime: string; endTime: string }> } }>('/api/tutors/me')
      .then((res) => {
        if (res.data?.availability) {
          const parsed = res.data.availability.map((av) => ({
            day: av.day,
            startTime: extractTime(av.startTime),
            endTime: extractTime(av.endTime),
          }))
          setSlots(parsed)
        }
      })
      .catch((err) => toast.error('Failed to load availability'))
      .finally(() => setLoading(false))
  }, [])

  function handleAddSlot(day: DayEnum) {
    setSlots((prev) => [...prev, { day, startTime: '09:00', endTime: '17:00' }])
  }

  function handleRemoveSlot(index: number) {
    setSlots((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSlotChange(index: number, field: 'startTime' | 'endTime', value: string) {
    setSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot))
    )
  }

  async function handleSave() {
    setSaving(true)
    const toastId = toast.loading('Saving schedule...')

    // Format for backend
    const payload = slots.map((s) => ({
      day: s.day,
      startTime: buildIsoTime(s.startTime),
      endTime: buildIsoTime(s.endTime),
    }))

    try {
      const res = await apiFetch<{ success: boolean; message?: string }>('/api/tutor/availability', {
        method: 'PATCH',
        body: JSON.stringify({ availabilities: payload }),
      })

      if (res.success) {
        toast.success('Availability schedule updated successfully!', { id: toastId })
      } else {
        toast.error(res.message || 'Failed to update schedule', { id: toastId })
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Manage Availability</h1>
        <p className="text-slate-400 mt-2">
          Define your weekly teaching schedule. Students can only book you during these slots.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
        >
          {saving ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Schedule
        </Button>
      </div>

      <div className="space-y-6">
        {DAYS.map((day) => {
          const daySlots = slots
            .map((slot, idx) => ({ ...slot, originalIndex: idx }))
            .filter((s) => s.day === day.value)

          return (
            <Card key={day.value} className="border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Day Header */}
                <div className="w-full sm:w-48 bg-slate-900 p-4 border-r border-slate-800 flex items-center justify-between sm:justify-start gap-3">
                  <h3 className="font-semibold text-slate-200">{day.label}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                    onClick={() => handleAddSlot(day.value)}
                    title="Add Slot"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Slots Area */}
                <div className="flex-1 p-4 min-h-[4rem] flex flex-col justify-center">
                  {daySlots.length === 0 ? (
                    <p className="text-sm text-slate-500 font-light flex items-center gap-2">
                      <Clock className="h-4 w-4 opacity-50" /> Unavailable
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {daySlots.map((slot) => (
                        <div key={slot.originalIndex} className="flex items-center gap-3">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => handleSlotChange(slot.originalIndex, 'startTime', e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                          <span className="text-slate-500 text-sm">to</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => handleSlotChange(slot.originalIndex, 'endTime', e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-md px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 ml-2"
                            onClick={() => handleRemoveSlot(slot.originalIndex)}
                            title="Remove Slot"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="p-4 flex gap-3 text-amber-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <div className="text-sm">
            <p className="font-semibold text-amber-500">Note on Availability</p>
            <p className="font-light mt-1 text-amber-200/80">
              All times should be entered in UTC. We are actively working on automatic timezone conversion in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
