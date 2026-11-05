<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '../auth'

const router = useRouter()
const pending = ref(false)
const error = ref('')

async function submit() {
  if (pending.value) return
  pending.value = true
  error.value = ''
  try {
    await logout()
    await router.replace({ name: 'login' })
  } catch (cause) {
    error.value = cause.message
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div>
    <v-btn variant="text" size="small" :loading="pending" :disabled="pending" @click="submit">ออกจากระบบ</v-btn>
    <v-alert v-if="error" variant="tonal" color="error" class="mt-2" role="alert">{{ error }}</v-alert>
  </div>
</template>
