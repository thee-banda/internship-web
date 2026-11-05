import express from 'express'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const app = express()
const port = Number(process.env.PORT || 3000)
const host = process.env.HOST || '127.0.0.1'
const dist = fileURLToPath(new URL('../dist/', import.meta.url))

app.disable('x-powered-by')
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

if (existsSync(path.join(dist, 'index.html'))) {
  app.use(express.static(dist, { index: false }))
  app.get('/{*splat}', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
} else {
  app.use((_req, res) => res.status(404).send('Frontend is not built. Run npm run build or use npm run dev.'))
}

const server = app.listen(port, host, () => {
  console.log(`Express: http://${host}:${port}`)
})
server.on('error', (error) => {
  console.error(`Server could not start: ${error.message}`)
  process.exitCode = 1
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close())
}
