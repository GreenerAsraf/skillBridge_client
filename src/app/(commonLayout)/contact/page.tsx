'use client'

import { Mail, Phone, Clock, Send } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ContactPage() {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    toast.success('Message sent! We will get back to you within 24 hours.')
    const form = e.target as HTMLFormElement
    form.reset()
  }

  return (
    <div className='bg-background text-foreground min-h-screen py-20 px-6 transition-colors duration-300'>
      <div className='max-w-4xl mx-auto space-y-12'>
        {/* Header */}
        <div className='text-center space-y-3'>
          <span className='inline-block text-xs font-semibold tracking-widest uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full'>
            Contact Support
          </span>
          <h1 className='text-4xl font-extrabold tracking-tight text-white'>
            Get in touch with us
          </h1>
          <p className='text-slate-400 font-light max-w-md mx-auto text-sm'>
            Have questions about booking? Or need help with your tutor account? Drop us a message below.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Info cards */}
          <div className='md:col-span-1 space-y-4'>
            {[
              { icon: <Mail className='h-4 w-4 text-emerald-400' />, title: 'Email Us', desc: 'support@skillbridge.edu' },
              { icon: <Phone className='h-4 w-4 text-cyan-400' />, title: 'Call Support', desc: '+1 (555) 304-4050' },
              { icon: <Clock className='h-4 w-4 text-indigo-400' />, title: 'Operation Hours', desc: 'Mon - Fri, 9 AM - 6 PM' }
            ].map((item, idx) => (
              <Card key={idx} className='border-slate-800 bg-slate-900/30 backdrop-blur-sm'>
                <CardContent className='p-5 flex items-start gap-4'>
                  <div className='h-9 w-9 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center shrink-0'>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className='font-semibold text-white text-xs'>{item.title}</h3>
                    <p className='text-xs text-slate-400 mt-0.5 font-light'>{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form */}
          <div className='md:col-span-2'>
            <Card className='border-slate-800 bg-slate-900/30 backdrop-blur-sm'>
              <CardContent className='p-8'>
                <form onSubmit={handleSubmit} className='space-y-5'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1.5'>
                      <label className='text-xs font-semibold text-slate-350'>First Name</label>
                      <input
                        required
                        type='text'
                        placeholder='John'
                        className='w-full text-sm px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600'
                      />
                    </div>
                    <div className='space-y-1.5'>
                      <label className='text-xs font-semibold text-slate-350'>Last Name</label>
                      <input
                        required
                        type='text'
                        placeholder='Doe'
                        className='w-full text-sm px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600'
                      />
                    </div>
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-xs font-semibold text-slate-350'>Email Address</label>
                    <input
                      required
                      type='email'
                      placeholder='john@example.com'
                      className='w-full text-sm px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600'
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <label className='text-xs font-semibold text-slate-350'>Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder='How can we help you?'
                      className='w-full text-sm px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-950/60 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600 resize-none'
                    />
                  </div>

                  <Button type='submit' className='w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-1.5 border-0'>
                    <Send className='h-4 w-4' />
                    <span>Send Message</span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
