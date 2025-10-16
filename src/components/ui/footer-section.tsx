'use client'

import React from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Facebook, Instagram, Youtube, Linkedin, Twitter, Github, Mail } from 'lucide-react'

interface FooterLink {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

interface FooterSection {
  label: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    label: 'Product',
    links: [
      { title: 'Features', href: '/features' },
      { title: 'Pricing', href: '/pricing' },
      { title: 'Departments', href: '/departments' },
      { title: 'Integration', href: '/integrations' },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'About Us', href: '/about' },
      { title: 'Blog', href: '/blog' },
      { title: 'Careers', href: '/careers' },
      { title: 'Contact', href: '/contact' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { title: 'Documentation', href: '/docs' },
      { title: 'API Reference', href: '/api' },
      { title: 'Help Center', href: '/help' },
      { title: 'Status', href: '/status' },
    ],
  },
  {
    label: 'Legal',
    links: [
      { title: 'Privacy Policy', href: '/privacy' },
      { title: 'Terms of Service', href: '/terms' },
      { title: 'Cookie Policy', href: '/cookies' },
      { title: 'GDPR', href: '/gdpr' },
    ],
  },
]

const socialLinks = [
  { title: 'Twitter', href: 'https://twitter.com/feasable', icon: Twitter },
  { title: 'LinkedIn', href: 'https://linkedin.com/company/feasable', icon: Linkedin },
  { title: 'GitHub', href: 'https://github.com/feasable', icon: Github },
  { title: 'Email', href: 'mailto:hello@feasable.org', icon: Mail },
]

export function Footer() {
  return (
    <footer className="relative w-full mt-auto border-t bg-gradient-to-b from-background via-background/95 to-background">
      {/* Gradient overlay */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand Section */}
          <AnimatedContainer className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <span className="text-xl">
              <span className="font-serif font-light">feasable</span><span className="font-serif font-bold">Spaces</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              AI-powered workspaces that work like humans. Delegate tasks, automate workflows, 
              and scale your business with intelligent departments.
            </p>
            <div className="flex gap-4 pt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.title}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.title}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </AnimatedContainer>

          {/* Links Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerLinks.map((section, index) => (
              <AnimatedContainer key={section.label} delay={0.1 + index * 0.05}>
                <h3 className="font-semibold text-sm mb-3">{section.label}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <AnimatedContainer delay={0.4}>
          <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} feasableSpaces. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/sitemap" className="hover:text-foreground transition-colors">
                Sitemap
              </a>
              <a href="/accessibility" className="hover:text-foreground transition-colors">
                Accessibility
              </a>
              <button className="hover:text-foreground transition-colors">
                🌐 English
              </button>
            </div>
          </div>
        </AnimatedContainer>
      </div>
    </footer>
  )
}

type ViewAnimationProps = {
  delay?: number
  className?: ComponentProps<typeof motion.div>['className']
  children: ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: 20, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ 
        delay, 
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
