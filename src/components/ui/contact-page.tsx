'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import {
  Check,
  Copy,
  LucideIcon,
  Mail,
  MapPin,
  Phone,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
} from 'lucide-react'
import { Button, ButtonProps } from '@/components/ui/button'

const APP_EMAIL = 'hello@feasable.org'
const APP_PHONE = '+1 (555) 123-4567'
const APP_PHONE_2 = '+1 (555) 987-6543'

export function ContactPage() {
  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/feasable',
      label: 'GitHub',
    },
    {
      icon: Twitter,
      href: 'https://twitter.com/feasable',
      label: 'Twitter',
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com/company/feasable',
      label: 'LinkedIn',
    },
    {
      icon: MessageSquare,
      href: 'https://discord.gg/feasable',
      label: 'Discord',
    },
  ]

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto h-full max-w-6xl lg:border-x">
        <div
          aria-hidden
          className="absolute inset-0 isolate -z-10 opacity-80 contain-strict"
        >
          <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,theme(colors.foreground/0.06)_0,hsla(0,0%,55%,.02)_50%,theme(colors.foreground/0.01)_80%)] absolute top-0 left-0 h-80 w-80 -translate-y-40 -rotate-45 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,theme(colors.foreground/0.04)_0,theme(colors.foreground/0.01)_80%,transparent_100%)] absolute top-0 left-0 h-80 w-60 translate-x-4 -translate-y-1/2 -rotate-45 rounded-full" />
          <div className="bg-[radial-gradient(50%_50%_at_50%_50%,theme(colors.foreground/0.04)_0,theme(colors.foreground/0.01)_80%,transparent_100%)] absolute top-0 left-0 h-80 w-60 -translate-y-40 -rotate-45 rounded-full" />
        </div>
        <div className="flex grow flex-col justify-center px-4 md:px-6 pt-32 pb-16">
          <h1 className="text-4xl font-bold md:text-5xl">Contact Us</h1>
          <p className="text-muted-foreground mb-5 text-base">
            Get in touch with the FeasableDepartments team. We're here to help you build your AI workforce.
          </p>
        </div>
        <BorderSeparator />
        <div className="grid md:grid-cols-3">
          <Box
            icon={Mail}
            title="Email"
            description="We respond to all emails within 24 hours."
          >
            <a
              href={`mailto:${APP_EMAIL}`}
              className="font-mono text-base font-medium tracking-wide hover:underline"
            >
              {APP_EMAIL}
            </a>
            <CopyButton className="size-6" test={APP_EMAIL} />
          </Box>
          <Box
            icon={MapPin}
            title="Office"
            description="Visit our headquarters in Silicon Valley."
          >
            <span className="font-mono text-base font-medium tracking-wide">
              1234 Innovation Drive, Suite 100, Palo Alto, CA 94301, United States
            </span>
          </Box>
          <Box
            icon={Phone}
            title="Phone"
            description="We're available Mon-Fri, 9am-6pm PST."
            className="border-b-0 md:border-r-0"
          >
            <div>
              <div className="flex items-center gap-x-2">
                <a
                  href={`tel:${APP_PHONE}`}
                  className="block font-mono text-base font-medium tracking-wide hover:underline"
                >
                  {APP_PHONE}
                </a>
                <CopyButton className="size-6" test={APP_PHONE} />
              </div>
              <div className="flex items-center gap-x-2">
                <a
                  href={`tel:${APP_PHONE_2}`}
                  className="block font-mono text-base font-medium tracking-wide hover:underline"
                >
                  {APP_PHONE_2}
                </a>
                <CopyButton className="size-6" test={APP_PHONE_2} />
              </div>
            </div>
          </Box>
        </div>
        <BorderSeparator />
        <div className="relative flex h-full min-h-[320px] items-center justify-center">
          <div
            className={cn(
              'absolute inset-0 size-full -z-10',
              'bg-[radial-gradient(color-mix(in_oklab,theme(colors.foreground)_30%,transparent)_1px,transparent_1px)]',
              'bg-[size:32px_32px]',
              '[mask-image:radial-gradient(ellipse_at_center,theme(colors.background)_30%,transparent)]',
            )}
          />

          <div className="relative z-10 space-y-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">
              Find us online
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted/50 hover:bg-accent flex items-center gap-x-2 rounded-full border px-4 py-2 transition-colors"
                >
                  <link.icon className="size-4" />
                  <span className="font-mono text-sm font-medium tracking-wide">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
            <div className="text-center pt-4">
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Join our community of businesses using AI departments to scale their operations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BorderSeparator() {
  return <div className="absolute inset-x-0 h-px w-full border-b" />
}

type ContactBox = React.ComponentProps<'div'> & {
  icon: LucideIcon
  title: string
  description: string
}

function Box({ title, description, className, children, ...props }: ContactBox) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between border-b md:border-r md:border-b-0',
        className,
      )}
    >
      <div className="bg-muted/40 flex items-center gap-x-3 border-b p-4">
        <props.icon className="text-muted-foreground size-5" strokeWidth={1} />
        <h2 className="font-heading text-lg font-medium tracking-wider">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-x-2 p-4 py-12">{children}</div>
      <div className="border-t p-4">
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  )
}

type CopyButtonProps = ButtonProps & {
  test: string
}

function CopyButton({
  className,
  variant = 'ghost',
  size = 'icon',
  test,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState<boolean>(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(test)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('disabled:opacity-100', className)}
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      disabled={copied || props.disabled}
      {...props}
    >
      <div
        className={cn(
          'transition-all',
          copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
        )}
      >
        <Check className="size-3.5 stroke-emerald-500" aria-hidden="true" />
      </div>
      <div
        className={cn(
          'absolute transition-all',
          copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
        )}
      >
        <Copy aria-hidden="true" className="size-3.5" />
      </div>
    </Button>
  )
}
