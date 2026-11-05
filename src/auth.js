import { readonly, ref } from 'vue'

const user = ref(null)
export const authUser = readonly(user)
export const authError = ref('')
export const homeRoute = (account) => ({ name: account.role === 'teacher' ? 'admin' : 'today' })

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`/api/auth/${path}`, {
      credentials: 'same-origin',
      signal: AbortSignal.timeout(10000),
      ...options,
    })
  } catch {
    throw new ApiError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่', 0)
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new ApiError(data?.error || 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่', response.status)
  }
  if (response.status !== 204 && !data?.user) {
    throw new ApiError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่', 0)
  }
  return data
}

export async function refreshSession() {
  try {
    const data = await request('me')
    user.value = data.user
    authError.value = ''
  } catch (error) {
    user.value = null
    if (error.status !== 401) throw error
    authError.value = ''
  }
  return user.value
}

export async function login(code, remember) {
  const data = await request('login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, remember }),
  })
  user.value = data.user
  authError.value = ''
  return user.value
}

export async function logout() {
  await request('logout', { method: 'POST' })
  user.value = null
  authError.value = ''
}
