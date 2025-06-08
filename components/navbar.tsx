import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export function Navbar() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text"
        >
          Rev&apos;s Tools
        </Link>
        <Link href="/">
          <Button variant="ghost" size="icon">
            <Home className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </header>
  )
}
