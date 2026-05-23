const confirmed = process.argv.includes('--yes')
const model = process.env.OLLAMA_MODEL || 'gemma4'
const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'

if (!confirmed) {
  console.log('Refusing to call Ollama without --yes. Ask before running request tests.')
  process.exit(2)
}

const response = await fetch(`${ollamaUrl}/api/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model,
    stream: false,
    prompt: 'Translate to Quebec French and return only the translated text: Hello world',
  }),
})

if (!response.ok) {
  throw new Error(`Ollama returned HTTP ${response.status}`)
}

const payload = await response.json()
console.log(payload.response)
