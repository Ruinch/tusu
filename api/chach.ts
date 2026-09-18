type ChatMessage = { role: 'user' | 'assistant'; text: string };

type RequestLike = { method?: string; body?: { messages?: unknown } };
type ResponseLike = {
  status: (code: number) => ResponseLike;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

const SYSTEM_PROMPT = 'Ты — образовательный советник Chach. Отвечай ТОЛЬКО на вопросы об учёбе, университетах, специальностях, программах, стипендиях, грантах и поступлении. На любые другие темы вежливо отказывай и возвращай разговор к теме образования. Общайся дружелюбно и по-человечески.';

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'GEMINI_API_KEY is not configured' });

  const rawMessages = req.body?.messages;
  if (!Array.isArray(rawMessages)) return res.status(400).json({ error: 'messages must be an array' });

  const messages = rawMessages
    .filter((item): item is ChatMessage => Boolean(item) && typeof item === 'object' && ((item as ChatMessage).role === 'user' || (item as ChatMessage).role === 'assistant') && typeof (item as ChatMessage).text === 'string')
    .slice(-12);
  if (!messages.some(message => message.role === 'user')) return res.status(400).json({ error: 'At least one user message is required' });

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: messages.map(({ role, text }) => ({ role: role === 'assistant' ? 'model' : 'user', parts: [{ text: text.slice(0, 4000) }] })),
        generationConfig: { temperature: 0.45, maxOutputTokens: 800 },
      }),
    });
    const data = await response.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[]; error?: { message?: string } };
    if (!response.ok) return res.status(502).json({ error: data.error?.message || 'Gemini request failed' });
    const text = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
    if (!text) return res.status(502).json({ error: 'Gemini did not return an answer' });
    return res.status(200).json({ text });
  } catch {
    return res.status(502).json({ error: 'Could not reach Gemini' });
  }
}
