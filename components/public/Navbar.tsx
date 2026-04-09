"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

function Logo() {
  const [logoError, setLogoError] = useState(false);
  return (
    <Link href="/" className="flex items-center gap-3">
      {!logoError ? (
        <Image
          src="/images/logo-ci.jpg"
          alt="CPTEDINDIA"
          width={220}
          height={64}
          className="h-14 w-auto object-contain"
          onError={() => setLogoError(true)}
          priority
        />
      ) : (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-900">
            <Shield className="h-6 w-6 text-amber-400" />
          </div>
          <span className="text-2xl font-bold text-gray-900">CPTEDINDIA</span>
        </>
      )}
      <span className="hidden sm:inline-block text-sm italic text-green-600 font-semibold leading-tight">
        Enabling Safer Space by Design
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Courses", href: "/courses" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm font-medium text-gray-600 hover:text-amber-500 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-amber-500 hover:bg-amber-400 text-white font-semibold">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-amber-500"
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
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Courses", href: "/courses" },
                { label: "Services", href: "/services" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm font-medium text-gray-600 hover:text-amber-500"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2 border-t border-gray-200">
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                    Log In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
