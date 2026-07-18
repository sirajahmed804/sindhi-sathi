'use client'

import { useState, useEffect } from 'react'
import { getFlashcards, deleteFlashcard } from '@/lib/storage'

const RTL_LANGUAGES = ['Sindhi', 'Urdu', 'Arabic']

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFlashcards()
  }, [])

  const loadFlashcards = () => {
    try {
      const cards = getFlashcards()
      setFlashcards(cards)
    } catch (err) {
      console.error('Failed to load flashcards:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id) => {
    try {
      deleteFlashcard(id)
      setFlashcards(flashcards.filter((card) => card.id !== id))
    } catch (err) {
      console.error('Failed to delete flashcard:', err)
    }
  }

  const toggleFlip = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const isRTL = (text) => {
    // Simple RTL detection
    return /[\u0600-\u06FF]/.test(text)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading flashcards...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Flashcards</h1>
        <p className="text-gray-600">
          {flashcards.length === 0 ? 'No flashcards yet. Start translating to build your collection!' : `You have ${flashcards.length} flashcard${flashcards.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {flashcards.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((card) => (
            <div
              key={card.id}
              className="h-64 cursor-pointer perspective"
              onClick={() => toggleFlip(card.id)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-300 transform ${
                  flipped[card.id] ? 'scale-x-[-1]' : ''
                }`}
              >
                {/* Front of card */}
                <div
                  className={`absolute w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-lg p-6 flex flex-col justify-center ${
                    flipped[card.id] ? 'hidden' : ''
                  } ${isRTL(card.word) ? 'rtl' : 'ltr'}`}
                >
                  <p className="text-white text-sm font-semibold mb-2">Click to flip</p>
                  <p className="text-white text-3xl font-bold break-words">{card.word}</p>
                </div>

                {/* Back of card */}
                <div
                  className={`absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 flex flex-col justify-between ${
                    flipped[card.id] ? '' : 'hidden'
                  } scale-x-[-1]`}
                >
                  <div className={isRTL(card.meaning) ? 'rtl' : 'ltr'}>
                    <p className="text-white text-sm font-semibold mb-2">Meaning</p>
                    <p className="text-white text-xl font-bold break-words">{card.meaning}</p>
                  </div>
                  <p className={`text-white text-xs italic mt-4 break-words ${isRTL(card.exampleSentence) ? 'rtl' : 'ltr'}`}>
                    "{card.exampleSentence}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete all option */}
      {flashcards.length > 0 && (
        <div className="text-center pt-8">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete all flashcards?')) {
                setFlashcards([])
                localStorage.removeItem('flashcards')
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Delete All Flashcards
          </button>
        </div>
      )}
    </div>
  )
}
