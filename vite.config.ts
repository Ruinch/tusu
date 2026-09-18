import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const CHACH_SYSTEM_PROMPT = 'Ты — образовательный советник Chach. Отвечай ТОЛЬКО на вопросы об учёбе, университетах, специальностях, программах, стипендиях, грантах и поступлении. На любые другие темы вежливо отказывай и возвращай разговор к теме образования. Общайся дружелюбно и по-человечески.'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'chach-anthropic-api',
        configureServer(server) {
          server.middlewares.use('/api/chach', async (req, res) => {
            if (req.method !== 'POST') { res.statusCode = 405; res.end(); return }
            if (!env.ANTHROPIC_API_KEY) { res.statusCode = 503; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' })); return }
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', async () => {
              try {
                const { messages } = JSON.parse(body)
                const anthropicMessages = messages.map(({ role, text }: { role: 'user' | 'assistant'; text: string }) => ({ role, content: text }))
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                  method: 'POST',
                  headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
                  body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 800, system: CHACH_SYSTEM_PROMPT, messages: anthropicMessages })
                })
                const data = await response.json() as { content?: { text?: string }[]; error?: { message?: string } }
                if (!response.ok) throw new Error(data.error?.message || 'Anthropic request failed')
                res.statusCode = 200; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ text: data.content?.[0]?.text || '' }))
              } catch (error) { res.statusCode = 500; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Chach request failed' })) }
            })
          })
        }
      }
    ]
  }
})