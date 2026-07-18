'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const isActive = (path) => pathname === path

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌐</span>
            <span className="text-xl font-bold text-indigo-600">Sindhi Sathi</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`font-semibold transition-colors ${
                isActive('/') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/translator"
              className={`font-semibold transition-colors ${
                isActive('/translator') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Translator
            </Link>
            <Link
              href="/flashcards"
              className={`font-semibold transition-colors ${
                isActive('/flashcards') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Flashcards
            </Link>
            <Link
              href="/quiz"
              className={`font-semibold transition-colors ${
                isActive('/quiz') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Quiz
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
