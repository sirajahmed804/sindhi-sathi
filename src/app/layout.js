import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'Sindhi Sathi - Multilingual Learning Companion',
  description: 'Learn Sindhi, Urdu, English, and Arabic with AI-powered translation, flashcards, and quizzes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
