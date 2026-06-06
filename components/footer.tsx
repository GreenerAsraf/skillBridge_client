import Link from 'next/link'
import { Github, Twitter, Linkedin, Heart, HelpCircle, Mail, MapPin } from 'lucide-react'

/**
 * Footer displays branding, navigation links, and copyright details at the bottom of the page.
 */
export default function Footer() {
  return (
    <footer className='relative border-t border-white/5 bg-slate-950 text-slate-400 overflow-hidden'>
      {/* Decorative Gradient Background */}
      <div className='absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-indigo-500 to-cyan-500' />
      <div className='absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute top-0 left-10 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none' />

      <div className='mx-auto max-w-6xl px-6 py-12 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-10'>
          {/* Brand */}
          <div className='space-y-4 col-span-1 md:col-span-1'>
            <Link href="/" className='text-2xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent tracking-tight'>
              SkillBridge
            </Link>
            <p className='text-xs font-light leading-relaxed text-slate-450'>
              Empowering students worldwide by connecting them with certified expert educators for instant, personalized learning.
            </p>
            <div className='flex items-center gap-3 pt-2'>
              {[
                { icon: <Github className='h-4 w-4' />, href: '#' },
                { icon: <Twitter className='h-4 w-4' />, href: '#' },
                { icon: <Linkedin className='h-4 w-4' />, href: '#' },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className='h-8 w-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-slate-900/80 transition-all duration-200'
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className='text-sm font-bold text-white mb-4 tracking-wider uppercase'>Platform</h4>
            <ul className='space-y-2.5 text-xs font-light'>
              <li>
                <Link href='/tutors' className='hover:text-emerald-400 transition-colors'>Browse Tutors</Link>
              </li>
              <li>
                <Link href='/register' className='hover:text-emerald-400 transition-colors'>Become a Tutor</Link>
              </li>
              <li>
                <Link href='/login' className='hover:text-emerald-400 transition-colors'>Student Login</Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className='text-sm font-bold text-white mb-4 tracking-wider uppercase'>Company</h4>
            <ul className='space-y-2.5 text-xs font-light'>
              <li>
                <Link href='/about' className='hover:text-emerald-400 transition-colors'>About Us</Link>
              </li>
              <li>
                <Link href='/contact' className='hover:text-emerald-400 transition-colors'>Contact Us</Link>
              </li>
              <li>
                <a href='#' className='hover:text-emerald-400 transition-colors'>Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className='space-y-3.5 text-xs font-light'>
            <h4 className='text-sm font-bold text-white mb-4 tracking-wider uppercase'>Get in Touch</h4>
            <div className='flex items-center gap-2.5'>
              <Mail className='h-4 w-4 text-emerald-400 shrink-0' />
              <span>support@skillbridge.edu</span>
            </div>
            <div className='flex items-center gap-2.5'>
              <MapPin className='h-4 w-4 text-cyan-400 shrink-0' />
              <span>100 Education Way, Suite 400</span>
            </div>
            <div className='flex items-center gap-2.5'>
              <HelpCircle className='h-4 w-4 text-indigo-400 shrink-0' />
              <span>FAQ & Help Desk</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className='border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-slate-500'>
          <p>© {new Date().getFullYear()} SkillBridge Inc. All rights reserved.</p>
          <p className='flex items-center gap-1'>
            Made with <Heart className='h-3 w-3 text-rose-500 fill-rose-500' /> for modern education.
          </p>
        </div>
      </div>
    </footer>
  )
}
