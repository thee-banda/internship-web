import express from 'express'
import session from 'express-session'
import { randomBytes } from 'node:crypto'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const users = new Map([
  ['65000001', { code: '65000001', name: 'นภัส วัฒนกุล', role: 'student' }],
  ['T001', { code: 'T001', name: 'อ.กมล', role: 'teacher' }],
])
const cookieName = 'internship.sid'
const cookieOptions = { path: '/', httpOnly: true, sameSite: 'lax', secure: 'auto' }
const dist = fileURLToPath(new URL('../dist/', import.meta.url))

export function createApp({ store, secret = process.env.SESSION_SECRET || randomBytes(32).toString('hex') } = {}) {
  const app = express()
  app.disable('x-powered-by')
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
  app.use('/api/auth', (_req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.use('/api/auth', express.json({ limit: '4kb' }), session({
    name: cookieName,
    secret,
    ...(store ? { store } : {}),
    resave: false,
    saveUninitialized: false,
    cookie: { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 },
  }))

  app.post('/api/auth/login', (req, res, next) => {
    const { code, remember = false } = req.body || {}
    if (typeof code !== 'string' || !code.trim() || typeof remember !== 'boolean') {
      return res.status(400).json({ error: 'กรุณากรอกรหัสนักศึกษา / รหัสอาจารย์ให้ถูกต้อง' })
    }
    const user = users.get(code.trim().toUpperCase())
    if (!user) return res.status(401).json({ error: 'ไม่พบรหัสผู้ใช้นี้' })

    req.session.regenerate((error) => {
      if (error) return next(error)
      req.session.userCode = user.code
      const lifetime = (remember ? 7 * 24 : 8) * 60 * 60 * 1000
      req.session.cookie.maxAge = lifetime
      req.session.expiresAt = Date.now() + lifetime
      req.session.save((saveError) => {
        if (saveError) return next(saveError)
        res.json({ user })
      })
    })
  })

  app.get('/api/auth/me', (req, res, next) => {
    const user = users.get(req.session.userCode)
    if (!user) return res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' })
    if (!Number.isFinite(req.session.expiresAt) || req.session.expiresAt <= Date.now()) {
      return req.session.destroy((error) => {
        if (error) return next(error)
        res.clearCookie(cookieName, { ...cookieOptions, secure: req.secure })
        res.status(401).json({ error: 'กรุณาเข้าสู่ระบบ' })
      })
    }
    res.json({ user })
  })

  app.post('/api/auth/logout', (req, res, next) => {
    req.session.destroy((error) => {
      if (error) return next(error)
      res.clearCookie(cookieName, { ...cookieOptions, secure: req.secure })
      res.sendStatus(204)
    })
  })

  app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

  if (existsSync(path.join(dist, 'index.html'))) {
    app.use(express.static(dist, { index: false }))
    app.get('/{*splat}', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
  } else {
    app.use((_req, res) => res.status(404).send('Frontend is not built. Run npm run build or use npm run dev.'))
  }

  app.use((error, _req, res, _next) => {
    const status = error.status === 400 || error.status === 413 ? error.status : 500
    res.status(status).json({ error: status === 500 ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'ข้อมูลคำขอไม่ถูกต้อง' })
  })
  return app
}
