'use client'

import { useState, useEffect } from 'react'
import { saveFlashcard, extractVocabulary } from '@/lib/storage'

const LANGUAGES = ['Auto-detect', 'Sindhi', 'Urdu', 'English', 'Arabic']
const RTL_LANGUAGES = ['Sindhi', 'Urdu', 'Arabic']

export default function Translator() {
  const [sourceLanguage, setSourceLanguage] = useState('Auto-detect')
  const [targetLanguage, setTargetLanguage] = useState('English')
  const [inputText, setInputText] = useState('')
  const [translation, setTranslation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [savedCount, setSavedCount] = useState(0)

  const isRTL = (lang) => RTL_LANGUAGES.includes(lang)
  const isSourceRTL = sourceLanguage !== 'Auto-detect' && isRTL(sourceLanguage)
  const isTargetRTL = isRTL(targetLanguage)

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputText,
          sourceLanguage,
          targetLanguage,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Translation failed')
      }

      const data = await response.json()
      setTranslation(data)

      // Auto-save flashcards from vocabulary
      if (data.vocabulary && data.vocabulary.length > 0) {
        let count = 0
        data.vocabulary.forEach((vocab) => {
          if (saveFlashcard(vocab)) {
            count++
          }
        })
        setSavedCount(count)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleTranslate()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Translator</h1>
        <p className="text-gray-600">Translate between Sindhi, Urdu, English, and Arabic</p>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Language</label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Language</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {LANGUAGES.filter((lang) => lang !== 'Auto-detect').map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Enter Text to Translate</label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type or paste text here..."
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${isSourceRTL ? 'rtl' : 'ltr'}`}
            rows="5"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {/* Translation Result */}
      {translation && (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Translation Result</h2>

            {/* Detected Language */}
            {translation.detectedLanguage && sourceLanguage === 'Auto-detect' && (
              <p className="text-sm text-gray-600 mb-4">
                <strong>Detected Language:</strong> {translation.detectedLanguage}
              </p>
            )}

            {/* Source and Target Text Side by Side */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  {sourceLanguage === 'Auto-detect' ? translation.detectedLanguage : sourceLanguage}
                </p>
                <p className={`text-lg text-gray-900 break-words ${isSourceRTL ? 'rtl' : 'ltr'}`}>
                  {inputText}
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-2">{targetLanguage}</p>
                <p className={`text-lg text-gray-900 break-words ${isTargetRTL ? 'rtl' : 'ltr'}`}>
                  {translation.translation}
                </p>
              </div>
            </div>

            {/* Grammar Note */}
            {translation.grammarNote && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
                <p className="text-sm font-semibold text-blue-900 mb-2">📝 Grammar Note</p>
                <p className="text-gray-700">{translation.grammarNote}</p>
              </div>
            )}

            {/* Vocabulary */}
            {translation.vocabulary && translation.vocabulary.length > 0 && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-4">
                  📚 Vocabulary ({savedCount} saved to flashcards)
                </p>
                <div className="space-y-3">
                  {translation.vocabulary.map((vocab, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-green-100">
                      <p className={`font-semibold text-gray-900 ${isTargetRTL ? 'rtl' : 'ltr'}`}>
                        {vocab.word}
                      </p>
                      <p className="text-sm text-gray-600">{vocab.meaning}</p>
                      <p className={`text-sm text-gray-500 italic mt-1 ${isTargetRTL ? 'rtl' : 'ltr'}`}>
                        {vocab.exampleSentence}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
