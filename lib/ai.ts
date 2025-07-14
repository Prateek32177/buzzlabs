interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function queryGroqAI(prompt: string): Promise<string> {
  console.log('Querying Groq AI with prompt:', prompt);
  const response = await fetch(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.2,
        top_p: 0.9,
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Groq API error: ${response.statusText} - ${errorBody}`);
  }

  const data: GroqResponse = await response.json();
  return data.choices[0]?.message?.content || 'No response generated';
}
