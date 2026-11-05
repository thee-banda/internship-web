import { createApp } from './app.js'

const app = createApp()
const port = Number(process.env.PORT || 3000)
const host = process.env.HOST || '127.0.0.1'

const server = app.listen(port, host)
server.on('listening', () => {
  console.log(`Express: http://${host}:${port}`)
})
server.on('error', (error) => {
  console.error(`Server could not start: ${error.message}`)
  process.exitCode = 1
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close())
}
