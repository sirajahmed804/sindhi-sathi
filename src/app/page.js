'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Sindhi Sathi</h1>
        <p className="text-2xl text-gray-700 mb-8">Your AI-Powered Multilingual Learning Companion</p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Master Sindhi, Urdu, English, and Arabic with intelligent translation, grammar insights, flashcards, and interactive quizzes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/translator" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold">
            Start Translating
          </Link>
          <Link href="/flashcards" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
            My Flashcards
          </Link>
          <Link href="/quiz" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold">
            Take Quiz
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          title="Multilingual Translation"
          description="Translate seamlessly between Sindhi, Urdu, English, and Arabic with AI-powered accuracy and grammar insights."
          icon="🌐"
        />
        <FeatureCard
          title="Smart Flashcards"
          description="Auto-generated vocabulary cards with definitions and example sentences. Build your language collection over time."
          icon="📚"
        />
        <FeatureCard
          title="Interactive Quizzes"
          description="Test your knowledge with multiple-choice quizzes generated from your saved flashcards. Track your progress."
          icon="🎯"
        />
      </section>

      {/* How It Works Section */}
      <section className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
        <div className="space-y-6">
          <StepCard step="1" title="Translate" description="Enter text in any of the four languages and get instant translations with grammar explanations." />
          <StepCard step="2" title="Learn" description="Flashcards are automatically created from translation results. Save them to build your personal vocabulary." />
          <StepCard step="3" title="Practice" description="Test yourself with AI-generated quizzes based on your saved flashcards." />
        </div>
      </section>

      {/* Language Support Section */}
      <section className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Supported Languages</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <LanguageCard language="Sindhi" nativeName="سنڌي" flag="🇵🇰" />
          <LanguageCard language="Urdu" nativeName="اردو" flag="🇵🇰" />
          <LanguageCard language="English" nativeName="English" flag="🇬🇧" />
          <LanguageCard language="Arabic" nativeName="العربية" flag="🇸🇦" />
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function StepCard({ step, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
        {step}
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function LanguageCard({ language, nativeName, flag }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 text-center">
      <div className="text-4xl mb-2">{flag}</div>
      <h3 className="text-lg font-bold text-gray-900">{language}</h3>
      <p className={`text-sm text-gray-600 mt-2 ${['Sindhi', 'Urdu', 'Arabic'].includes(language) ? 'rtl' : 'ltr'}`}>
        {nativeName}
      </p>
    </div>
  )
}
