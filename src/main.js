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

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/:pathMatch(.*)*', redirect: '/login' },
  ],
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
