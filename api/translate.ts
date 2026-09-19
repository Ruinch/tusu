type RequestLike = { method?: string; body?: { language?: unknown; texts?: unknown } };
type ResponseLike = { status: (code: number) => ResponseLike; setHeader: (name: string, value: string) => void; json: (body: unknown) => void };

const TARGETS: Record<string, string> = { kk: 'Kazakh (қазақша)', en: 'English' };

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'GEMINI_API_KEY is not configured' });
  const language = typeof req.body?.language === 'string' ? req.body.language : '';
  const texts = Array.isArray(req.body?.texts) ? req.body.texts.filter((text): text is string => typeof text === 'string' && text.trim().length > 0).slice(0, 120) : [];
  if (!TARGETS[language] || texts.length === 0) return res.status(400).json({ error: 'language and texts are required' });

  const prompt = `Translate each Russian UI string below into ${TARGETS[language]}. Return ONLY a JSON array of strings in the same order. Preserve university names, programme names, exam names (IELTS, SAT, ЕНТ/UNT), numbers, dates, URLs, abbreviations, and the user's name exactly. Do not add commentary.\n\n${JSON.stringify(texts)}`;
  let lastError = 'Translation service is temporarily unavailable';
  for (const model of [...new Set([process.env.GEMINI_MODEL, 'gemini-2.5-flash', 'gemini-2.5-flash-lite'].filter(Boolean))] as string[]) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.1, responseMimeType: 'application/json', maxOutputTokens: 8192 } }),
    });
    const data = await response.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[]; error?: { message?: string } };
    if (!response.ok) { lastError = data.error?.message || lastError; continue; }
    try {
      const raw = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim() || '[]';
      const translations = JSON.parse(raw) as unknown;
      if (Array.isArray(translations) && translations.length === texts.length && translations.every(item => typeof item === 'string')) return res.status(200).json({ translations });
      lastError = 'Invalid translation response';
    } catch { lastError = 'Invalid translation response'; }
  }
  return res.status(503).json({ error: lastError });
}
