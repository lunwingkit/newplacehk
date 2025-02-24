import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-xl mb-8">Oops! The page you're looking for doesn't exist.</p>
        <img src="/404-illustration.svg" alt="404 Illustration" className="w-64 h-64 mb-8" />
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </main>
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 友趣館xNewplacehk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

