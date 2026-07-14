'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { signIn } from '@/lib/auth-client'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'
import * as z from 'zod'
import { Zap, ShieldCheck } from 'lucide-react'

// Demo credentials — update these to match your seeded DB data
const DEMO_CREDENTIALS = {
  user: { email: 'teacher1@gmail.com', password: 'Asraf123' },
  
  admin: { email: 'admin@example.com',   password: 'password123'   },
}

// Login only needs email + password — role is returned from the server session
const formSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Minimum length is 8'),
})

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()

  useEffect(() => {
    const message = sessionStorage.getItem('skillbridge_auth_error')
    if (message) {
      sessionStorage.removeItem('skillbridge_auth_error')
      toast.error(message)
    }
  }, [])

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators:    { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading('Logging in...')
      const { data, error } = await signIn.email({
        email:    value.email,
        password: value.password
      })

      if (error) {
        toast.error(error.message || 'Something went wrong, please try again.', { id: toastId })
      } else if (data) {
        toast.success('Logged in successfully!', { id: toastId })
        const roleRedirect: Record<string, string> = {
          STUDENT: '/dashboard',
          TUTOR:   '/tutor/dashboard',
          ADMIN:   '/admin',
        }
        const role = (data.user as any).role as string | undefined
        window.location.href = roleRedirect[role?.toUpperCase() ?? ''] ?? '/dashboard'
      }
    }
  })

  /** Auto-fill the form with demo credentials and submit. */
  async function handleDemoLogin(type: 'user' | 'admin') {
    const creds = DEMO_CREDENTIALS[type]
    form.setFieldValue('email',    creds.email)
    form.setFieldValue('password', creds.password)
    // Small delay to let React flush the updated values
    await new Promise((r) => setTimeout(r, 80))
    form.handleSubmit()
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id='login-form'
          onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}
        >
          <FieldGroup>
            <form.Field
              name='email'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      type='email'
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder='m@example.com'
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Field
              name='password'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      type='password'
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className='flex flex-col gap-4 justify-end'>
        {/* Primary login */}
        <Button form='login-form' type='submit' className='w-full'>
          Login
        </Button>

        {/* Demo quick-access */}
        <div className='w-full space-y-2'>
          <div className='flex items-center gap-2'>
            <span className='h-px flex-1 bg-border' />
            <span className='text-[11px] text-muted-foreground font-medium uppercase tracking-wider'>
              Quick Demo
            </span>
            <span className='h-px flex-1 bg-border' />
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Button
              id='demo-user-btn'
              type='button'
              variant='outline'
              size='sm'
              onClick={() => handleDemoLogin('user')}
              className='w-full flex items-center gap-1.5 text-xs border-indigo-500/40 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 transition-all'
            >
              <Zap className='h-3 w-3' />
              Demo Teacher
            </Button>
            <Button
              id='demo-admin-btn'
              type='button'
              variant='outline'
              size='sm'
              onClick={() => handleDemoLogin('admin')}
              className='w-full flex items-center gap-1.5 text-xs border-amber-500/40 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/10 transition-all'
            >
              <ShieldCheck className='h-3 w-3' />
              Demo Admin
            </Button>
          </div>
        </div>

        <p className='text-sm text-center text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <a href='/register' className='underline underline-offset-4'>
            Sign up
          </a>
        </p>
      </CardFooter>
    </Card>
  )
}
