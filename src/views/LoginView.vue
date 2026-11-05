<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authError, homeRoute, login } from '../auth'

const router = useRouter()

const form = ref(null)
const account = ref('')
const remember = ref(false)
const pending = ref(false)
const helpDialog = ref(null)
const required = (value) => Boolean(value?.trim()) || 'กรุณากรอกข้อมูลในช่องนี้'

async function submit() {
  if (pending.value) return
  pending.value = true
  authError.value = ''
  try {
    const { valid } = await form.value.validate()
    if (!valid) return
    const user = await login(account.value.trim(), remember.value)
    await router.replace(homeRoute(user))
  } catch (error) {
    authError.value = error.message
  } finally {
    pending.value = false
  }
}

function openHelp(kind) {
  helpDialog.value = kind
}
</script>

<template>
  <div class="login-shell">
    <section class="login-content" aria-labelledby="page-title">
      <header class="page-heading">
        <h1 id="page-title">เข้าสู่ระบบ</h1>
        <p>ระบบจัดการฝึกงานสำหรับนักศึกษาและอาจารย์</p>
      </header>

      <v-card class="login-card" variant="outlined" rounded="lg">
        <div class="welcome">
          <h2>ยินดีต้อนรับกลับ</h2>
          <p>กรอกรหัสประจำตัวเพื่อดูงาน ลงเวลา<br class="mobile-break" />และติดตามความคืบหน้าการฝึกงาน</p>
        </div>

        <v-form ref="form" validate-on="submit" @submit.prevent="submit">
          <div class="credential-field">
            <label for="account">รหัสนักศึกษา / รหัสอาจารย์</label>
            <v-text-field
              id="account"
              v-model="account"
              name="username"
              autocomplete="username"
              placeholder="เช่น 65000001 หรือ T001"
              :rules="[required]"
              hide-details="auto"
              spellcheck="false"
              autocapitalize="none"
              :disabled="pending"
              @update:model-value="authError = ''"
              required
            />
          </div>

          <div class="login-options">
            <v-checkbox
              v-model="remember"
              label="จดจำการเข้าสู่ระบบ"
              name="remember"
              density="compact"
              hide-details
              color="primary"
              :disabled="pending"
            />
            <button class="text-action" type="button" @click="openHelp('code')">
              ลืมรหัสประจำตัว?
            </button>
          </div>

          <v-alert v-if="authError" color="error" variant="tonal" class="mb-4 login-error" role="alert">{{ authError }}</v-alert>

          <v-btn block color="primary" type="submit" height="44" class="login-submit" :loading="pending" :disabled="pending">
            เข้าสู่ระบบ
          </v-btn>
        </v-form>

        <section class="demo-accounts" aria-labelledby="demo-title">
          <h2 id="demo-title">บัญชีตัวอย่าง</h2>
          <p>กรอกได้โดยไม่ใช้รหัสผ่าน</p>
          <dl>
            <div><dt>นักศึกษา · นภัส</dt><dd><code>65000001</code></dd></div>
            <div><dt>อาจารย์ · อ.กมล</dt><dd><code>T001</code></dd></div>
          </dl>
        </section>
      </v-card>

      <section class="account-assistance" aria-labelledby="help-title">
        <h2 id="help-title">ยังไม่มีบัญชีหรือเข้าสู่ระบบไม่ได้?</h2>
        <p>บัญชีผู้ใช้จะได้รับจากผู้ดูแลระบบ<br />หากยังไม่มีบัญชี กรุณาติดต่อผู้ดูแลเพื่อขอใช้งาน</p>
        <v-btn block variant="outlined" height="44" @click="openHelp('account')">
          ติดต่อผู้ดูแลระบบ
        </v-btn>
      </section>
    </section>

    <footer class="privacy-footer">
      <p>ข้อมูลของคุณใช้สำหรับการจัดการฝึกงานเท่านั้น</p>
    </footer>

    <v-dialog
      :model-value="helpDialog !== null"
      max-width="380"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      @update:model-value="helpDialog = $event ? helpDialog : null"
    >
      <v-card class="help-card" rounded="lg">
        <h2 id="dialog-title">{{ helpDialog === 'code' ? 'ลืมรหัสประจำตัว' : 'ติดต่อผู้ดูแลระบบ' }}</h2>
        <p id="dialog-description">
          {{ helpDialog === 'code'
            ? 'กรุณาติดต่อผู้ดูแลระบบของสถานศึกษา เพื่อขอความช่วยเหลือในการตรวจสอบรหัสนักศึกษาหรือรหัสอาจารย์'
            : 'กรุณาติดต่อผู้ดูแลระบบของสถานศึกษาหรือหน่วยงานฝึกงาน เพื่อขอบัญชีหรือขอความช่วยเหลือในการเข้าสู่ระบบ' }}
        </p>
        <v-btn block color="primary" height="44" autofocus @click="helpDialog = null">เข้าใจแล้ว</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>
