"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import WalletConnect from "./wallet-connect"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Token", path: "/token" },
    { name: "Upgrade", path: "/upgrade" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-red-500" />
            <span className="font-bold text-xl">Fire</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.path ? "text-foreground font-bold" : "text-foreground/60",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="flex items-center">
          <WalletConnect
            onConnect={(address) => console.log("Connected:", address)}
            onDisconnect={() => console.log("Disconnected")}
          />
        </div>
      </div>
    </header>
  )
}
