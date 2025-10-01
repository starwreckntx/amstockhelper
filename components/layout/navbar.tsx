
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Factory,
  BarChart3,
  FileText,
  Search,
  Settings,
  User,
  LogOut,
  Menu,
  ShieldCheck,
  Wrench,
  Database,
  TrendingUp
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['operator', 'qa_manager', 'supervisor', 'admin'] },
  { name: 'Production', href: '/production', icon: Factory, roles: ['operator', 'supervisor', 'admin'] },
  { name: 'Quality Control', href: '/quality', icon: ShieldCheck, roles: ['qa_manager', 'supervisor', 'admin'] },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench, roles: ['operator', 'supervisor', 'admin'] },
  { name: 'Search & Query', href: '/search', icon: Search, roles: ['operator', 'qa_manager', 'supervisor', 'admin'] },
  { name: 'Traceability', href: '/traceability', icon: TrendingUp, roles: ['qa_manager', 'supervisor', 'admin'] },
  { name: 'Data Entry', href: '/data-entry', icon: Database, roles: ['operator', 'supervisor', 'admin'] },
  { name: 'Reports', href: '/reports', icon: FileText, roles: ['supervisor', 'admin'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
]

export function Navbar() {
  const sessionResult = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle the case where useSession returns undefined during build/pre-rendering
  const session = sessionResult?.data ?? null
  const userRole = session?.user?.role ?? 'operator'
  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  )

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Factory className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-lg">American Spincast</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                  isActive
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {userRole.replace('_', ' ')}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <Factory className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-lg">American Spincast</span>
                </div>
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 text-sm font-medium p-2 rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
