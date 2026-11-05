import assert from 'node:assert/strict'
import { once } from 'node:events'
import { test, before, after } from 'node:test'
import session from 'express-session'
import { createApp } from '../server/app.js'

const store = new session.MemoryStore()
const server = createApp({ store, secret: 'integration-tests-only-secret' }).listen(0, '127.0.0.1')
let base
before(async () => {
  await once(server, 'listening')
  base = `http://127.0.0.1:${server.address().port}`
})
after(async () => {
  server.closeAllConnections()
  await new Promise((resolve) => server.close(resolve))
})

function api(route, { body, cookie, method = body ? 'POST' : 'GET' } = {}) {
  return fetch(`${base}/api/auth/${route}`, {
    method,
    headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
}
const cookieOf = (response) => response.headers.get('set-cookie').split(';')[0]

test('requires a session and validates the code as a string', async () => {
  assert.equal((await api('me')).status, 401)
  for (const body of [{}, { code: '' }, { code: '   ' }, { code: 65000001 }, { code: { role: 'teacher' } }, { code: 'T001', remember: 'yes' }]) {
    assert.equal((await api('login', { body })).status, 400)
  }
  const unknown = await api('login', { body: { code: 'UNKNOWN' } })
  assert.equal(unknown.status, 401)
  assert.equal((await unknown.json()).error, 'ไม่พบรหัสผู้ใช้นี้')
  assert.equal(unknown.headers.get('set-cookie'), null)
})

test('student role is chosen by the server, even when another role is submitted', async () => {
  const response = await api('login', { body: { code: '65000001', role: 'teacher' } })
  assert.equal(response.status, 200)
  const expected = { user: { code: '65000001', name: 'นภัส วัฒนกุล', role: 'student' } }
  assert.deepEqual(await response.json(), expected)
  const cookie = response.headers.get('set-cookie')
  assert.match(cookie, /^internship\.sid=/)
  assert.match(cookie, /HttpOnly/i)
  assert.match(cookie, /SameSite=Lax/i)
  assert.doesNotMatch(cookie, /; Secure/i)
  const expiry = new Date(cookie.match(/Expires=([^;]+)/)[1]).getTime()
  assert.ok(Math.abs(expiry - Date.now() - 8 * 60 * 60 * 1000) < 5000)
  const me = await api('me', { cookie: cookieOf(response) })
  assert.equal(me.status, 200)
  assert.deepEqual(await me.json(), expected)
  assert.equal(me.headers.get('cache-control'), 'no-store')
})

test('teacher code is trimmed and case-insensitive, with seven-day remember cookie', async () => {
  const response = await api('login', { body: { code: ' t001 ', remember: true } })
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { user: { code: 'T001', name: 'อ.กมล', role: 'teacher' } })
  const cookie = response.headers.get('set-cookie')
  const expiry = new Date(cookie.match(/Expires=([^;]+)/)[1]).getTime()
  assert.ok(Math.abs(expiry - Date.now() - 7 * 24 * 60 * 60 * 1000) < 5000)
  assert.equal((await api('me', { cookie: cookieOf(response) })).status, 200)
})

test('logging in regenerates the session and invalidates its previous identifier', async () => {
  const first = await api('login', { body: { code: '65000001' } })
  const oldCookie = cookieOf(first)
  const second = await api('login', { body: { code: 'T001' }, cookie: oldCookie })
  const newCookie = cookieOf(second)
  assert.notEqual(oldCookie, newCookie)
  assert.equal((await api('me', { cookie: oldCookie })).status, 401)
  assert.equal((await api('me', { cookie: newCookie })).status, 200)
})

test('logout clears the cookie and makes the former session unusable', async () => {
  const response = await api('login', { body: { code: '65000001' } })
  const cookie = cookieOf(response)
  const result = await api('logout', { method: 'POST', cookie })
  assert.equal(result.status, 204)
  assert.match(result.headers.get('set-cookie'), /internship\.sid=;/)
  assert.match(result.headers.get('set-cookie'), /Expires=Thu, 01 Jan 1970/)
  assert.equal((await api('me', { cookie })).status, 401)
  assert.equal((await api('logout', { method: 'POST' })).status, 204)
})

test('expired server sessions are rejected even if their browser cookie is still valid', async () => {
  const response = await api('login', { body: { code: 'T001' } })
  const cookie = cookieOf(response)
  const sessionId = decodeURIComponent(cookie.slice(cookie.indexOf('=') + 1)).slice(2).split('.')[0]
  const saved = await new Promise((resolve, reject) => store.get(sessionId, (error, value) => error ? reject(error) : resolve(value)))
  saved.expiresAt = Date.now() - 1000
  await new Promise((resolve, reject) => store.set(sessionId, saved, (error) => error ? reject(error) : resolve()))
  assert.equal((await api('me', { cookie })).status, 401)
})

test('malformed JSON returns a useful error, and the health endpoint still works', async () => {
  const response = await fetch(`${base}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
  })
  assert.equal(response.status, 400)
  assert.equal(typeof (await response.json()).error, 'string')
  assert.deepEqual(await (await fetch(`${base}/api/health`)).json(), { status: 'ok' })
  assert.equal((await fetch(`${base}/api/missing`)).status, 404)
})
