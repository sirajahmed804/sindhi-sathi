import Anthropic from '@anthropic-ai/sdk'

let client

// Initialize Anthropic client with proper error handling
try {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set')
  }
  client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })
} catch (initError) {
  console.error('Failed to initialize Anthropic client:', initError.message)
}

const SYSTEM_PROMPT = `You are an expert multilingual translator specializing in Sindhi, Urdu, English, and Arabic.

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

Important:
- Be accurate with translations
- Grammar notes should be simple and educational
- Vocabulary should be from the TRANSLATED text, not the source
- Always return valid JSON
- Example sentences should be natural and relevant`

export async function POST(request) {
  console.log('[API] Translate request received')
  
  try {
    // Check if client was initialized
    if (!client) {
      console.error('[API] Anthropic client not initialized')
      return new Response(
        JSON.stringify({ error: 'API client initialization failed. Check ANTHROPIC_API_KEY.' }),
        { status: 500 }
      )
    }

    // Validate API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[API] ANTHROPIC_API_KEY not configured in environment')
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500 }
      )
    }

    console.log('[API] Parsing request body')
    const { text, sourceLanguage, targetLanguage } = await request.json()

    // Validate input
    if (!text || !text.trim()) {
      console.error('[API] Empty text provided')
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400 }
      )
    }

    if (!targetLanguage) {
      console.error('[API] No target language provided')
      return new Response(
        JSON.stringify({ error: 'Target language is required' }),
        { status: 400 }
      )
    }

    console.log(`[API] Translation request: ${sourceLanguage || 'Auto-detect'} -> ${targetLanguage}`)

    // Build user message
    let userMessage = `Translate this text to ${targetLanguage}:\n\n"${text}"`
    
    if (sourceLanguage && sourceLanguage !== 'Auto-detect') {
      userMessage = `Translate this text from ${sourceLanguage} to ${targetLanguage}:\n\n"${text}"`
    } else {
      userMessage = `Auto-detect the language and translate this text to ${targetLanguage}:\n\n"${text}"`
    }

    console.log('[API] Calling Claude API...')
    
    // Call Claude API
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    })

    console.log('[API] Claude API response received')

    // Extract response text
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    console.log('[API] Parsing JSON from response')
    
    // Parse JSON response
    let parsedResponse
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        console.error('[API] No JSON found in response:', responseText.substring(0, 200))
        throw new Error('No JSON found in response')
      }
      parsedResponse = JSON.parse(jsonMatch[0])
      console.log('[API] JSON parsed successfully')
    } catch (parseError) {
      console.error('[API] JSON parse error:', parseError.message)
      console.error('[API] Response text:', responseText.substring(0, 500))
      return new Response(
        JSON.stringify({ error: 'Failed to parse translation response' }),
        { status: 500 }
      )
    }

    // Validate parsed response has required fields
    if (!parsedResponse.translation) {
      console.error('[API] Invalid response structure - missing translation field')
      return new Response(
        JSON.stringify({ error: 'Invalid response structure' }),
        { status: 500 }
      )
    }

    console.log('[API] Sending successful response')
    return new Response(JSON.stringify(parsedResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('[API] Unhandled error:', error.message)
    console.error('[API] Error type:', error.constructor.name)
    console.error('[API] Error details:', error)

    // Handle specific error types
    if (error.message.includes('API') || error.message.includes('authenticate')) {
      console.error('[API] API authentication or configuration error')
      return new Response(
        JSON.stringify({ error: 'API Error: ' + error.message }),
        { status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Translation failed: ' + error.message }),
      { status: 500 }
    )
  }
}
