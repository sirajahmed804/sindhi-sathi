// Flashcard storage using localStorage

const FLASHCARDS_KEY = 'flashcards'

/**
 * Generate a unique ID for flashcards
 */
function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Get all flashcards from localStorage
 */
export function getFlashcards() {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem(FLASHCARDS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error reading flashcards:', error)
    return []
  }
}

/**
 * Save a new flashcard or vocabulary item
 */
export function saveFlashcard(vocabItem) {
  if (typeof window === 'undefined') return false
  
  try {
    const flashcards = getFlashcards()
    
    // Check if word already exists
    const exists = flashcards.some(
      (card) => card.word.toLowerCase() === vocabItem.word.toLowerCase()
    )
    
    if (exists) {
      return false // Already exists, don't add duplicate
    }
    
    const newCard = {
      id: generateId(),
      word: vocabItem.word,
      meaning: vocabItem.meaning,
      exampleSentence: vocabItem.exampleSentence,
      createdAt: new Date().toISOString(),
    }
    
    flashcards.push(newCard)
    localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(flashcards))
    return true
  } catch (error) {
    console.error('Error saving flashcard:', error)
    return false
  }
}

/**
 * Delete a flashcard by ID
 */
export function deleteFlashcard(id) {
  if (typeof window === 'undefined') return false
  
  try {
    const flashcards = getFlashcards()
    const filtered = flashcards.filter((card) => card.id !== id)
    localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting flashcard:', error)
    return false
  }
}

/**
 * Extract vocabulary items from text (placeholder)
 */
export function extractVocabulary(text) {
  // This is a placeholder. In production, you might use NLP
  // For now, return empty array - vocabulary is extracted by the API
  return []
}
