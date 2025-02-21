"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, User, X, Calendar, Info, LogOut, Settings, LogIn, Loader2 } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import { ModeToggle } from "@/components/mode-toggle"
import { signIn, signOut, useSession } from "next-auth/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const { data: session, status } = useSession()

  const handleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/events" })
    } catch (error) {
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoginModalOpen(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    toast.success("Logged out successfully")
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset"
  }, [isMobileMenuOpen])

  const NavItem = ({
    href,
    icon: Icon,
    children,
    onClick,
  }: { href?: string; icon: React.ElementType; children: React.ReactNode; onClick?: () => void }) => {
    const content = (
      <>
        <Icon className="h-4 w-4 mr-2" />
        {children}
      </>
    )

    return (
      <Button variant="ghost" className="w-full justify-start" onClick={onClick} asChild={!!href}>
        {href ? <Link href={href}>{content}</Link> : content}
      </Button>
    )
  }

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <User className="h-4 w-4 mr-2" />
          {session?.user?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <NavItem href="/events" icon={Calendar}>
            Events
          </NavItem>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavItem href="/personal-info" icon={Info}>
            Personal Info
          </NavItem>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavItem href="/admin" icon={Settings}>
            Admin Dashboard
          </NavItem>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <NavItem icon={LogOut} onClick={handleLogout}>
            Logout
          </NavItem>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const AccountMenu = () => (
    <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
      <DialogTrigger asChild>
        {session?.user ? (
          <UserMenu />
        ) : (
          <NavItem icon={LogIn} onClick={() => setIsLoginModalOpen(true)}>
            Login
          </NavItem>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login to Event Showcase</DialogTitle>
          <DialogDescription>Choose your preferred login method</DialogDescription>
        </DialogHeader>
        <Button onClick={handleLogin} className="w-full">
          <LogIn className="mr-2 h-4 w-4" />
          Login with Google
        </Button>
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground dark:bg-black dark:text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold">
              Event Showcase
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavItem href="/events" icon={Calendar}>
                Events
              </NavItem>
              <AccountMenu />
              <ModeToggle />
            </nav>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 top-16 bg-primary dark:bg-black z-50 md:hidden overflow-y-auto">
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-1">
                  <NavItem href="/events" icon={Calendar} onClick={toggleMobileMenu}>
                    Events
                  </NavItem>
                  {session?.user ? (
                    <>
                      <NavItem href="/my-events" icon={Calendar} onClick={toggleMobileMenu}>
                        My Events
                      </NavItem>
                      <NavItem href="/personal-info" icon={Info} onClick={toggleMobileMenu}>
                        Personal Info
                      </NavItem>
                      <NavItem href="/admin" icon={Settings} onClick={toggleMobileMenu}>
                        Admin Dashboard
                      </NavItem>
                      <NavItem
                        icon={LogOut}
                        onClick={() => {
                          handleLogout()
                          toggleMobileMenu()
                        }}
                      >
                        Logout
                      </NavItem>
                    </>
                  ) : (
                    <NavItem
                      icon={LogIn}
                      onClick={() => {
                        handleLogin()
                        toggleMobileMenu()
                      }}
                    >
                      Login
                    </NavItem>
                  )}
                  <ModeToggle />
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>
      <Toaster position="bottom-right" />
    </>
  )
}

