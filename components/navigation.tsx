"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Bell, User, MessageCircle, PlusSquare, Menu, LogIn, UserPlus } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from '@/components/theme-toggle'

const sidebarNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Search', href: '/search', icon: Search },
  { name: 'Create', href: '/create', icon: PlusSquare },
  { name: 'Activity', href: '/notifications', icon: Bell },
  { name: 'Messages', href: '/messages', icon: MessageCircle },
  { name: 'Profile', href: '/profile', icon: User },
]


export function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex">
        <aside className="w-[200px] border-r px-4 py-6 flex flex-col h-screen">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">ThreadsClone</h1>
          </div>
          <ScrollArea className="flex-1">
            <nav className="grid gap-2">
              {sidebarNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
              <div className="my-4 border-t" />

            </nav>
          </ScrollArea>
          <div className="mt-auto">
            <ThemeToggle />
          </div>
        </aside>
      </div>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
        <div className="container mx-auto px-4">
          <ul className="flex justify-between py-3">
            {sidebarNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={cn(
                  "flex flex-col items-center text-sm",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}>
                  <item.icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 right-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[300px]">
            <nav className="grid gap-2 mt-6">
              {sidebarNavItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
              <div className="my-4 border-t" />

            </nav>
            <div className="mt-6">
              <ThemeToggle />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

