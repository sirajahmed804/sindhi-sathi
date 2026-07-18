import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

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
  try {
    // Validate API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500 }
      )
    }

    const { text, sourceLanguage, targetLanguage } = await request.json()

    // Validate input
    if (!text || !text.trim()) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { status: 400 }
      )
    }

    if (!targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Target language is required' }),
        { status: 400 }
      )
    }

    // Build user message
    let userMessage = `Translate this text to ${targetLanguage}:\n\n"${text}"`
    
    if (sourceLanguage && sourceLanguage !== 'Auto-detect') {
      userMessage = `Translate this text from ${sourceLanguage} to ${targetLanguage}:\n\n"${text}"`
    } else {
      userMessage = `Auto-detect the language and translate this text to ${targetLanguage}:\n\n"${text}"`
    }

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

    // Extract response text
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse JSON response
    let parsedResponse
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      parsedResponse = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Response text:', responseText)
      return new Response(
        JSON.stringify({ error: 'Failed to parse translation response' }),
        { status: 500 }
      )
    }

    // Validate parsed response has required fields
    if (!parsedResponse.translation) {
      return new Response(
        JSON.stringify({ error: 'Invalid response structure' }),
        { status: 500 }
      )
    }

    return new Response(JSON.stringify(parsedResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Translation error:', error)

    // Handle specific error types
    if (error.message.includes('API')) {
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
