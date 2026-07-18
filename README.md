# Sindhi Sathi - Multilingual Learning Companion

## Overview

**Sindhi Sathi** is an AI-powered educational web application designed to help learners master Sindhi, Urdu, English, and Arabic through intelligent translation, grammar explanations, interactive flashcards, and quizzes.

Built as a **final-year course project**, this is a fully functional, production-ready application suitable for deployment.

## Live URL

🚀 **[Deploy on Vercel](#deployment-instructions)** (See instructions below)

## Features

### 1. **Multilingual Translator** 🌐
- Translate seamlessly between 4 languages: Sindhi ↔ Urdu ↔ English ↔ Arabic
- Auto-detect source language capability
- AI-powered accurate translations using Claude API
- Grammar note for each translation explaining key linguistic differences
- Side-by-side comparison of source and translated text
- Proper right-to-left (RTL) text rendering for Sindhi, Urdu, and Arabic

### 2. **Smart Flashcards** 📚
- Automatically generated from translation results
- Each card includes: word, meaning, and example sentence
- One-click flip animation to reveal meanings
- Persistent storage using browser localStorage
- Easy delete functionality
- Build a personal vocabulary collection over time

### 3. **Interactive Quizzes** 🎯
- Multiple-choice quiz format
- Questions drawn from saved flashcards
- 4 options per question (1 correct, 3 intelligent distractors)
- Real-time score tracking
- Progress bar showing quiz completion
- Retry functionality
- Minimum 2 flashcards required to start

### 4. **User-Friendly Interface** ✨
- Clean, modern design with Tailwind CSS
- Mobile-responsive layout
- Intuitive navigation between Translator, Flashcards, and Quiz
- Landing page with feature overview
- Error handling and user feedback

## Technology Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** (styling)
- **localStorage** (client-side data persistence)

### Backend
- **Next.js API Routes** (`/api/translate`)
- **Anthropic Claude API** (3.5 Sonnet model)

### Deployment
- **Vercel** (recommended)
- Node.js 18+

## AI System Prompt

The Claude API is configured with the following system prompt:

```
You are an expert multilingual translator specializing in Sindhi, Urdu, English, and Arabic.

Your task is to:
1. Identify the source language (if auto-detect is selected)
2. Translate the text accurately from source to target language
3. Provide ONE concise grammar/structure note explaining a key difference between the two languages
4. Extract 2-4 key vocabulary words with meanings and example sentences

Respond ONLY with valid JSON in this exact format:
{
  "detectedLanguage": "Language Name" (only if auto-detect),
  "translation": "translated text",
  "grammarNote": "One sentence explaining a key linguistic difference",
  "vocabulary": [
    {
      "word": "word in target language",
      "meaning": "English meaning",
      "exampleSentence": "Example in target language"
    }
  ]
}
```

## How to Run Locally

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- An Anthropic API key (get one at https://console.anthropic.com)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/sirajahmed804/sindhi-sathi.git
   cd sindhi-sathi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Start using the app!

### Build for Production

```bash
npm run build
npm start
```

## Deployment on Vercel

### Step 1: Push to GitHub (Already Done)
Your repository is already public at: `https://github.com/sirajahmed804/sindhi-sathi`

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"New Project"**
4. Import the `sindhi-sathi` repository
5. In **Environment Variables**, add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `(your Anthropic API key)`
6. Click **"Deploy"**

### Step 3: Access Your Live App
Once deployed, Vercel will provide a URL like: `https://sindhi-sathi.vercel.app`

### Updating Deployments
Any push to the `main` branch will automatically trigger a new deployment on Vercel.

## Project Structure

```
sindhi-sathi/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── translate/
│   │   │       └── route.js          # Claude API integration
│   │   ├── page.js                   # Landing page
│   │   ├── translator/
│   │   │   └── page.js               # Translation interface
│   │   ├── flashcards/
│   │   │   └── page.js               # Flashcard management
│   │   ├── quiz/
│   │   │   └── page.js               # Quiz interface
│   │   ├── globals.css               # Global styles
│   │   └── layout.js                 # Root layout
│   ├── components/
│   │   └── Navigation.js             # Navigation bar
│   └── lib/
│       └── storage.js                # localStorage utilities
├── .env.local.example                # Environment variables template
├── .gitignore                        # Git ignore file
├── package.json                      # Dependencies
├── tailwind.config.js                # Tailwind configuration
├── postcss.config.js                 # PostCSS configuration
├── next.config.js                    # Next.js configuration
└── README.md                         # This file
```

## Features in Detail

### Translator Page (`/translator`)
- **Language Selection**: Choose source and target languages
- **Auto-detect**: Automatically detects source language
- **Input Textarea**: Paste or type text to translate
- **Result Display**: Shows translation with grammar note and vocabulary
- **Auto-save Flashcards**: Vocabulary is automatically saved
- **Keyboard Shortcut**: Ctrl+Enter or Cmd+Enter to translate

### Flashcards Page (`/flashcards`)
- **Card Display**: Interactive flip cards showing word/meaning
- **Click to Flip**: Click any card to reveal the meaning
- **Delete Option**: Remove individual cards
- **Bulk Delete**: Clear all flashcards at once
- **RTL Support**: Proper text direction for Sindhi, Urdu, Arabic

### Quiz Page (`/quiz`)
- **Quiz Setup**: Start button with flashcard count
- **Question Format**: Word shown, 4 multiple-choice options
- **Score Tracking**: Real-time score display
- **Progress Bar**: Visual progress through quiz
- **Answer Feedback**: Correct answers highlighted in green, incorrect in red
- **Results View**: Final score and retry option

## API Endpoint

### `POST /api/translate`

**Request Body:**
```json
{
  "text": "Text to translate",
  "sourceLanguage": "Sindhi",
  "targetLanguage": "English"
}
```

**Response:**
```json
{
  "detectedLanguage": "Sindhi",
  "translation": "Translated text here",
  "grammarNote": "Grammar explanation",
  "vocabulary": [
    {
      "word": "word",
      "meaning": "meaning",
      "exampleSentence": "example sentence"
    }
  ]
}
```

## Supported Languages

1. **Sindhi** 🇵🇰
   - Native script: Sindhi script (right-to-left)
   - Also supported: Urdu-modified script

2. **Urdu** 🇵🇰
   - Script: Nastaliq/Naskh (right-to-left)
   - Widely spoken in Pakistan

3. **English** 🇬🇧
   - Script: Latin (left-to-right)
   - International language

4. **Arabic** 🇸🇦
   - Script: Arabic (right-to-left)
   - Religious and academic importance in South Asia

## Data Storage

- **Flashcards**: Stored in browser `localStorage` under key `flashcards`
- **No Backend Database**: Data persists per device/browser
- **Data Format**: JSON array of flashcard objects

```javascript
// Example localStorage structure
[
  {
    "id": "abc123def",
    "word": "سنڌي",
    "meaning": "Sindhi",
    "exampleSentence": "مان سنڌي ڪلڙي آهيان",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## Error Handling

- **Empty Input**: User is prompted to enter text
- **API Failures**: Clear error messages displayed
- **Network Issues**: Graceful error handling with retry option
- **Invalid Configuration**: Check `.env.local` for correct API key
- **Quiz Validation**: Minimum 2 flashcards required

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## Known Limitations

1. Data is stored locally per device (no cloud sync)
2. Requires valid Anthropic API key for translations
3. Translation quality depends on Claude model capabilities
4. Minimum 2 flashcards required for quiz mode

## Future Enhancements

- [ ] User authentication and cloud sync
- [ ] Spaced repetition algorithm for flashcards
- [ ] Pronunciation guide with audio
- [ ] Contextual word recommendations
- [ ] Export/import flashcard sets
- [ ] Performance analytics dashboard
- [ ] Collaborative learning features

## Troubleshooting

### "API key not configured" error
- Ensure `.env.local` file exists
- Verify `ANTHROPIC_API_KEY` is set correctly
- Restart the development server

### Translations not working
- Check API key validity at https://console.anthropic.com
- Ensure you have API credits available
- Check browser console for specific error messages

### Flashcards not saving
- Check if localStorage is enabled in browser
- Clear browser cache and try again
- Check browser's localStorage quota

### RTL text not displaying correctly
- Ensure your browser supports RTL text
- Try a different browser
- Check system language settings

## Contributing

This is a course project. For improvements or bug fixes:
1. Create a new branch
2. Make your changes
3. Submit a pull request with clear description

## License

This project is created for educational purposes as a final-year course project.

## Contact

- **GitHub**: [@sirajahmed804](https://github.com/sirajahmed804)
- **Project Repository**: https://github.com/sirajahmed804/sindhi-sathi

## Screenshots

*Screenshots to be added after deployment*

- Landing Page
- Translator Interface
- Flashcard View
- Quiz Mode
- Mobile View

---

**Made with ❤️ for Sindhi language learners everywhere**
