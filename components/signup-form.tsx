"use client"

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
  FieldDescription,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { signUp, betterAuthClient } from '@/lib/auth-client'
import { useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.email('Invalid email address'),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  password: z.string().min(8, 'Minimum length is 8'),
  confirmPassword: z.string(),
  role: z.enum(['STUDENT', 'TUTOR'], {
    message: 'Please select a role',
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      image: '',
      password: '',
      confirmPassword: '',
      role: 'STUDENT' as 'STUDENT' | 'TUTOR'
    },
    validators: {
      onSubmit: ({ value }: { value: { name: string; email: string; image: string; password: string; confirmPassword: string; role: 'STUDENT' | 'TUTOR' } }) => {
        const result = formSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map((e: { message: string }) => e.message).join(', ')
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading('Creating account...')

      // Use uploaded file (data URL) if present, otherwise use typed URL
      const imageValue = avatarDataUrl || (value.image.trim() || undefined)

      const { data, error } = await signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        image: imageValue,
        role: value.role,
      })

      if (error) {
        console.log(error, "error in sign up ")
        toast.error(error.message || 'Something went wrong, please try again.', { id: toastId })
      } else if (data) {
        toast.success(`Registered successfully as ${value.role.toLowerCase()}!`, { id: toastId })
        const roleRedirect: Record<string, string> = {
          STUDENT: '/dashboard',
          TUTOR: '/tutor/dashboard',
        }
        window.location.href = roleRedirect[value.role] ?? '/dashboard'
      }
    }
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setAvatarPreview(result)
      setAvatarDataUrl(result)
      // Clear the URL field since we have a file
      form.setFieldValue('image', '')
    }
    reader.readAsDataURL(file)
  }

  function handleUrlChange(url: string, fieldChange: (v: string) => void) {
    fieldChange(url)
    if (url.trim()) {
      setAvatarPreview(url.trim())
      setAvatarDataUrl(null) // clear uploaded file
    } else {
      setAvatarPreview(null)
    }
  }

  function clearAvatar() {
    setAvatarPreview(null)
    setAvatarDataUrl(null)
    form.setFieldValue('image', '')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id='signup-form'
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}>
          <FieldGroup>
            <form.Field
              name='name'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='John Doe'
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

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
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='m@example.com'
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            {/* Profile Picture Upload Section */}
            <Field>
              <FieldLabel>Profile Picture (Optional)</FieldLabel>
              <div className='flex items-center gap-4'>
                {/* Avatar preview */}
                <div className='relative flex-shrink-0'>
                  {avatarPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={avatarPreview}
                        alt='avatar preview'
                        className='h-14 w-14 rounded-full object-cover ring-2 ring-indigo-500/40'
                        onError={() => setAvatarPreview(null)}
                      />
                      <button
                        type='button'
                        onClick={clearAvatar}
                        className='absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-red-600 transition-colors'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </>
                  ) : (
                    <button
                      type='button'
                      onClick={() => fileRef.current?.click()}
                      className='h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-2 border-dashed border-indigo-500/40 flex items-center justify-center hover:border-indigo-500/70 transition-colors'
                    >
                      <Camera className='h-5 w-5 text-indigo-400' />
                    </button>
                  )}
                </div>

                <div className='flex-1 space-y-2'>
                  {/* Upload button */}
                  <div className='flex items-center gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => fileRef.current?.click()}
                      className='text-xs h-7'
                    >
                      Upload File
                    </Button>
                    <span className='text-xs text-muted-foreground'>or paste URL below</span>
                  </div>

                  {/* URL input */}
                  <form.Field
                    name='image'
                    children={(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <>
                          <Input
                            type='url'
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => handleUrlChange(e.target.value, field.handleChange)}
                            placeholder='https://example.com/avatar.jpg'
                            className='h-8 text-xs'
                            disabled={!!avatarDataUrl}
                          />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </>
                      )
                    }}
                  />
                </div>
              </div>
              <input
                ref={fileRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleFileChange}
              />
            </Field>

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

            <form.Field
              name='confirmPassword'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
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

            <form.Field
              name='role'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Account Type</FieldLabel>
                    <select
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value as any)}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TUTOR">Tutor</option>
                    </select>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className='flex flex-col gap-5 justify-end'>
        <Button form='signup-form' type='submit' className='w-full'>
          Create Account
        </Button>
        <Button 
          variant='outline' 
          type='button' 
          className='w-full'
          onClick={async () => {
            await betterAuthClient.signIn.social({
              provider: 'google',
              callbackURL: '/dashboard'
            })
          }}
        >
          Sign up with Google
        </Button>
        <FieldDescription className='px-6 text-center'>
          Already have an account? <a href='/login'>Sign in</a>
        </FieldDescription>
      </CardFooter>
    </Card>
  )
}
