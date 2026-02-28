"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-blue-800">CPTEDINDIA</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">Home</Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">About</Link>
            <Link href="/courses" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">Courses</Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors">Contact</Link>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">Log In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800">Sign Up</Button>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col gap-4">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-blue-700" onClick={() => setMenuOpen(false)}>About</Link>
              <Link href="/courses" className="text-sm font-medium text-gray-600 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Courses</Link>
              <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-700" onClick={() => setMenuOpen(false)}>Contact</Link>
              <div className="flex gap-3 pt-2 border-t border-gray-200">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Log In</Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-blue-700 hover:bg-blue-800">Sign Up</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
