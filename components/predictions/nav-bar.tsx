'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogoutButton } from '@/components/logout-button'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import wc26Logo from '@/app/wc26.png'

interface NavBarProps {
  userIdentifier: string
}

const NAV_LINKS = [
  { href: '/predictions', label: 'Predictions' },
]

export function NavBar({ userIdentifier }: NavBarProps) {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <div className="flex items-center gap-6">
          <Link
            href="/predictions"
            className="flex items-center gap-2 text-base font-bold tracking-tight text-zinc-950 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition-colors"
          >
            <Image
              src={wc26Logo}
              alt="World Cup 2026 Logo"
              width={24}
              height={24}
              className="h-6 w-auto"
            />
            <span>WC Predictor</span>
          </Link>
          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Button key={link.href} asChild variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900">
                <Link
                  href={link.href}
                  className={cn(
                    pathname.startsWith(link.href) && 'bg-zinc-100 text-zinc-950 font-semibold dark:bg-zinc-900 dark:text-white'
                  )}
                >
                  {link.label}
                </Link>
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <span className="hidden sm:inline text-sm text-zinc-500 dark:text-zinc-400">
            {userIdentifier}
          </span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  )
}
