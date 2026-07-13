'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

type FaqItem = {
  q: string
  a: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How do I find the right tutor?',
    a: 'Use our search and filter tools to narrow tutors by subject, category, price range, and rating. Each profile shows their bio, subjects, hourly rate, and student reviews so you can make an informed choice.',
  },
  {
    q: 'How does booking a session work?',
    a: "Visit any tutor's profile and choose an available time slot from their calendar. After confirming your booking, you'll receive a confirmation and can manage it from your student dashboard.",
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We support secure online payments via our integrated payment gateway. All transactions are encrypted and your financial details are never stored on our servers.',
  },
  {
    q: 'Can I cancel or reschedule a session?',
    a: 'Yes — you can cancel confirmed sessions directly from your dashboard. For rescheduling, contact the tutor through the platform. Cancellation policies may vary by tutor.',
  },
  {
    q: 'How are tutors verified?',
    a: 'Every tutor profile goes through an admin review before becoming visible on the platform. We verify their identity and qualifications to ensure quality and safety.',
  },
  {
    q: "What if I'm not satisfied with a session?",
    a: "We have a satisfaction policy — if a session doesn't meet expectations, reach out to our support team within 24 hours and we'll work to resolve it fairly for both parties.",
  },
  {
    q: 'Can I become a tutor on SkillBridge?',
    a: "Absolutely! Sign up, select the Tutor role, complete your profile with your subjects, rates, and availability. Your profile will be reviewed by our admin team before going live.",
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className='py-24 px-6 bg-background border-t border-border'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-14'>
          <span className='inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full mb-4'>
            ❓ Got Questions?
          </span>
          <h2 className='text-3xl md:text-4xl font-extrabold text-foreground tracking-tight'>
            Frequently Asked Questions
          </h2>
          <p className='text-muted-foreground mt-3 font-light'>
            Everything you need to know about SkillBridge.
          </p>
        </div>

        <div className='space-y-3'>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'border-indigo-500/30 bg-indigo-500/5'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <button
                  id={`faq-item-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className='w-full flex items-center justify-between gap-4 px-6 py-5 text-left group'
                  aria-expanded={isOpen}
                >
                  <span
                    className={`font-semibold text-sm leading-snug transition-colors duration-200 ${
                      isOpen ? 'text-indigo-500 dark:text-indigo-300' : 'text-foreground group-hover:text-foreground/80'
                    }`}
                  >
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'rotate-180 text-indigo-500 dark:text-indigo-400'
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className='overflow-hidden'>
                    <p className='px-6 pb-5 text-sm text-muted-foreground leading-relaxed'>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
