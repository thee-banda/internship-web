import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { th } from 'vuetify/locale'
import 'vuetify/styles'
import '@fontsource/noto-sans-thai/400.css'
import '@fontsource/noto-sans-thai/500.css'
import '@fontsource/noto-sans-thai/600.css'
import '@fontsource/noto-sans-thai/700.css'
import './styles.css'
import App from './App.vue'
import LoginView from './views/LoginView.vue'
import TodayView from './views/TodayView.vue'
import AdminView from './views/AdminView.vue'
import { authError, homeRoute, refreshSession } from './auth'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView, meta: { title: 'เข้าสู่ระบบ' } },
    { path: '/today', name: 'today', component: TodayView, meta: { title: 'วันนี้ของคุณ', role: 'student' } },
    { path: '/admin', name: 'admin', component: AdminView, meta: { title: 'ภาพรวมการฝึกงาน', role: 'teacher' } },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
})

router.beforeEach(async (to) => {
  let user
  try {
    user = await refreshSession()
  } catch (error) {
    authError.value = error.message
    return to.name === 'login' ? true : { name: 'login' }
  }
  if (to.meta.role && !user) return { name: 'login' }
  if (user && (to.name === 'login' || (to.meta.role && to.meta.role !== user.role))) {
    return homeRoute(user)
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'ระบบจัดการฝึกงาน'} · ระบบจัดการฝึกงาน`
})

const vuetify = createVuetify({
  locale: { locale: 'th', fallback: 'en', messages: { th } },
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  theme: {
    defaultTheme: 'internship',
    themes: {
      internship: {
        dark: false,
        colors: {
          primary: '#262626',
          background: '#FAFAFA',
          surface: '#FFFFFF',
          'on-surface': '#262626',
          error: '#B3261E',
        },
      },
    },
  },
  defaults: {
    VBtn: { rounded: 'sm', elevation: 0 },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')
