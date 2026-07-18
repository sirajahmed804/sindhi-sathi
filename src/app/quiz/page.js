'use client'

import { useState, useEffect } from 'react'
import { getFlashcards } from '@/lib/storage'

const RTL_LANGUAGES = ['Sindhi', 'Urdu', 'Arabic']

export default function Quiz() {
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([])

  useEffect(() => {
    const cards = getFlashcards()
    setFlashcards(cards)
    setLoading(false)
  }, [])

  const generateQuestions = (cards) => {
    if (cards.length < 2) return []

    return cards.map((card) => {
      const options = [card.meaning]
      const availableCards = cards.filter((c) => c.id !== card.id)

      // Get 3 random distractors
      while (options.length < 4 && availableCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCards.length)
        options.push(availableCards[randomIndex].meaning)
        availableCards.splice(randomIndex, 1)
      }

      // Shuffle options
      const shuffledOptions = options.sort(() => Math.random() - 0.5)

      return {
        word: card.word,
        correctAnswer: card.meaning,
        options: shuffledOptions,
      }
    })
  }

  const startQuiz = () => {
    if (flashcards.length < 2) {
      alert('You need at least 2 flashcards to start a quiz')
      return
    }

    const questions = generateQuestions(flashcards)
    setQuizQuestions(questions)
    setQuizStarted(true)
    setCurrentIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setAnswered(false)
  }

  const handleAnswer = (selectedOption) => {
    if (answered) return

    setSelectedAnswer(selectedOption)
    setAnswered(true)

    if (selectedOption === quizQuestions[currentIndex].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      // Quiz ended
      setQuizStarted(false)
    }
  }

  const handleRestart = () => {
    startQuiz()
  }

  const isRTL = (text) => {
    return /[\u0600-\u06FF]/.test(text)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading quiz...</p>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz</h1>
          <p className="text-gray-600">Test your knowledge with flashcard-based quizzes</p>
        </div>

        {flashcards.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              No flashcards available. Create some flashcards by translating text first!
            </p>
          </div>
        ) : flashcards.length < 2 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              You need at least 2 flashcards to start a quiz. You have {flashcards.length}. Keep translating!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-8">
              <p className="text-6xl font-bold text-indigo-600 mb-4">{flashcards.length}</p>
              <p className="text-gray-600 text-lg">Flashcards ready for quiz</p>
            </div>
            <button
              onClick={startQuiz}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
            >
              Start Quiz
            </button>
          </div>
        )}
      </div>
    )
  }

  // Quiz is in progress
  const currentQuestion = quizQuestions[currentIndex]
  const isCurrentRTL = isRTL(currentQuestion.word)

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Question {currentIndex + 1} of {quizQuestions.length}
          </h1>
          <div className="text-2xl font-bold text-indigo-600">Score: {score}</div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <p className="text-gray-600 text-sm mb-4">What is the meaning of:</p>
        <p className={`text-5xl font-bold text-indigo-600 mb-8 break-words ${isCurrentRTL ? 'rtl' : 'ltr'}`}>
          {currentQuestion.word}
        </p>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option === currentQuestion.correctAnswer
            const isSelected = selectedAnswer === option
            let buttonClass = 'bg-white border-2 border-gray-300 hover:border-indigo-500 text-gray-900'

            if (answered) {
              if (isCorrect) {
                buttonClass = 'bg-green-100 border-2 border-green-500 text-green-900'
              } else if (isSelected && !isCorrect) {
                buttonClass = 'bg-red-100 border-2 border-red-500 text-red-900'
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={answered}
                className={`w-full p-4 rounded-lg font-semibold transition-colors text-left ${buttonClass} ${isRTL(option) ? 'rtl' : 'ltr'}`}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>

      {/* Next Button */}
      {answered && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          {currentIndex === quizQuestions.length - 1 ? (
            <button
              onClick={handleRestart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
            >
              View Results
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
            >
              Next Question
            </button>
          )}
        </div>
      )}
    </div>
  )
}
