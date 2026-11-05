<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // นำเข้า useRouter สำหรับเปลี่ยนหน้า
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'

const router = useRouter() // เรียกใช้งาน router

const form = ref(null)
const account = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(false)
const helpDialog = ref(null)
const required = (value) => Boolean(value?.trim()) || 'กรุณากรอกข้อมูลในช่องนี้'

function submit() {
  // ข้ามการตรวจสอบเงื่อนไข กดแล้วไปหน้า Today ทันที
  router.push('/today')
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
        <p>ระบบจัดการฝึกงานสำหรับนักศึกษา</p>
      </header>

      <v-card class="login-card" variant="outlined" rounded="lg">
        <div class="welcome">
          <h2>ยินดีต้อนรับกลับ</h2>
          <p>เข้าสู่ระบบเพื่อดูงาน ลงเวลา และติดตาม<br class="mobile-break" />ความคืบหน้าการฝึกงานของคุณ</p>
        </div>

        <v-form ref="form" @submit.prevent="submit">
          <div class="credential-field">
            <label for="account">อีเมลหรือรหัสนักศึกษา</label>
            <v-text-field
              id="account"
              v-model="account"
              name="username"
              autocomplete="username"
              placeholder="กรอกอีเมลหรือรหัสนักศึกษา"
              :rules="[required]"
              hide-details="auto"
              spellcheck="false"
              autocapitalize="none"
              required
            />
          </div>

          <div class="credential-field">
            <label for="password">รหัสผ่าน</label>
            <v-text-field
              id="password"
              v-model="password"
              name="password"
              autocomplete="current-password"
              placeholder="กรอกรหัสผ่าน"
              :type="showPassword ? 'text' : 'password'"
              :rules="[required]"
              hide-details="auto"
              required
            >
              <template #append-inner>
                <v-btn
                  :icon="showPassword ? mdiEyeOffOutline : mdiEyeOutline"
                  :aria-label="showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'"
                  :aria-pressed="showPassword"
                  class="password-toggle"
                  variant="text"
                  size="small"
                  type="button"
                  @click="showPassword = !showPassword"
                />
              </template>
            </v-text-field>
          </div>

          <div class="login-options">
            <v-checkbox
              v-model="remember"
              label="จดจำการเข้าสู่ระบบ"
              name="remember"
              density="compact"
              hide-details
              color="primary"
            />
            <button class="text-action" type="button" @click="openHelp('password')">
              ลืมรหัสผ่าน?
            </button>
          </div>

          <v-btn block color="primary" type="submit" height="44" class="login-submit">
            เข้าสู่ระบบ
          </v-btn>
        </v-form>
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
        <h2 id="dialog-title">{{ helpDialog === 'password' ? 'ลืมรหัสผ่าน' : 'ติดต่อผู้ดูแลระบบ' }}</h2>
        <p id="dialog-description">
          {{ helpDialog === 'password'
            ? 'กรุณาติดต่อผู้ดูแลระบบของสถานศึกษาหรือหน่วยงานฝึกงาน เพื่อขอความช่วยเหลือในการตั้งรหัสผ่านใหม่'
            : 'กรุณาติดต่อผู้ดูแลระบบของสถานศึกษาหรือหน่วยงานฝึกงาน เพื่อขอบัญชีหรือขอความช่วยเหลือในการเข้าสู่ระบบ' }}
        </p>
        <v-btn block color="primary" height="44" autofocus @click="helpDialog = null">เข้าใจแล้ว</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>