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
    defaultValues: {
      email: '',
      password: ''
    },
    validators: {
      onSubmit: formSchema
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading('Logging in...')

      const { data, error } = await signIn.email({
        email: value.email,
        password: value.password
      })
      console.log(data, error, "error in login  ");


      if (error) {
        toast.error(error.message || 'Something went wrong, please try again.', { id: toastId })
      } else if (data) {
        toast.success('Logged in successfully!', { id: toastId })
        const roleRedirect: Record<string, string> = {
          STUDENT: '/dashboard',
          TUTOR: '/tutor/dashboard',
          ADMIN: '/admin',
        }
        // Redirect based on the role stored in the session by the backend
        const role = (data.user as any).role as string | undefined
        window.location.href = roleRedirect[role?.toUpperCase() ?? ''] ?? '/dashboard'
      }
    }
  })

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
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}>
          <FieldGroup>
            <form.Field
              name='email'
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            <form.Field
              name='password'
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className='flex flex-col gap-5 justify-end'>
        <Button form='login-form' type='submit' className='w-full'>
          Login
        </Button>
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
