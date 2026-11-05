<template>
  <div class="today-page bg-grey-lighten-4">
    <!-- Main Content Container -->
      <v-container class="px-4 py-6 max-w-md">
        
        <!-- ส่วนหัว: วันนี้ของคุณ -->
        <div class="mb-4">
          <LogoutButton class="mb-2" />
          <h1 class="text-h5 font-weight-bold text-grey-darken-4">วันนี้ของคุณ</h1>
          <p class="text-subtitle-2 text-grey-darken-1">{{ authUser?.name }} • ฝึกงานสัปดาห์ที่ 8 / 16</p>
          <p class="text-body-2 font-weight-medium text-grey-darken-3 mt-1">พฤหัสบดี 29 ต.ค. 2569</p>
        </div>

        <!-- 1. การ์ดเวลาปฏิบัติงาน -->
        <v-card class="mb-4 rounded-xl pa-4" elevation="1">
          <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-1">เวลาปฏิบัติงาน</h3>
          <p class="text-body-2 text-grey-darken-1 mb-4">ยังไม่ได้เช็คเข้า • เริ่มงาน 09:00 น.</p>
          <v-btn
            block
            color="grey-darken-4"
            class="text-white rounded-lg text-capitalize font-weight-bold"
            elevation="0"
            size="large"
            @click="handleCheckIn"
          >
            เช็คเข้างาน
          </v-btn>
        </v-card>

        <!-- หัวข้อ: งานที่ต้องจัดการ -->
        <h2 class="text-h6 font-weight-bold text-grey-darken-4 mb-3">งานที่ต้องจัดการ</h2>

        <!-- 2. การ์ดงาน: รายงานสัปดาห์ที่ 7 (เกินกำหนด) -->
        <v-card class="mb-4 rounded-xl pa-4 border-s-lg" border="error" elevation="1">
          <div class="d-flex align-center text-error font-weight-bold mb-1">
            <v-icon :icon="mdiAlertCircle" size="small" class="me-1"></v-icon>
            รายงานสัปดาห์ที่ 7
          </div>
          <p class="text-body-2 text-grey-darken-1 mb-3">เกินกำหนด 1 วัน • ส่ง 28 ต.ค. 2569</p>
          <div class="text-body-2">
            <span class="text-orange-darken-2 font-weight-medium">กำลังทำ</span> 
            <span class="text-grey-darken-1">→</span> 
            <a href="#" class="text-decoration-none text-grey-darken-4 font-weight-medium" @click.prevent="goToDetail('report-7')">ดูรายละเอียด</a>
          </div>
        </v-card>

        <!-- 3. การ์ดงาน: ออกแบบหน้าเข้าสู่ระบบ -->
        <v-card class="mb-4 rounded-xl pa-4" elevation="1">
          <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-1">ออกแบบหน้าเข้าสู่ระบบ</h3>
          <p class="text-body-2 text-grey-darken-1 mb-3">ส่งพรุ่งนี้ • 30 ต.ค. 2569</p>
          <div class="text-body-2">
            <span class="text-grey-darken-1 font-weight-medium">ยังไม่เริ่ม</span> 
            <span class="text-grey-darken-1">→</span> 
            <a href="#" class="text-decoration-none text-grey-darken-4 font-weight-medium" @click.prevent="goToAllTasks">ดูงานทั้งหมด</a>
          </div>
        </v-card>

        <!-- 4. การ์ดงาน: ประชุมติดตามประจำสัปดาห์ -->
        <v-card class="mb-4 rounded-xl pa-4" elevation="1">
          <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4 mb-1">ประชุมติดตามประจำสัปดาห์</h3>
          <p class="text-body-2 text-grey-darken-1 mb-4">วันนี้ 10:00–10:30 น. • ออนไลน์</p>
          <v-btn
            block
            color="grey-darken-4"
            class="text-white rounded-lg text-capitalize font-weight-bold"
            elevation="0"
            size="large"
            @click="handleJoinMeeting"
          >
            ดูนัดและเข้าประชุม
          </v-btn>
        </v-card>

        <!-- 5. การ์ดการแจ้งเตือน -->
        <v-card class="mb-4 rounded-xl pa-4 cursor-pointer" elevation="1" @click="goToNotifications">
          <div class="d-flex justify-space-between align-center">
            <span class="text-subtitle-1 font-weight-bold text-grey-darken-4">การแจ้งเตือน 3 รายการ</span>
            <v-icon :icon="mdiChevronRight" color="grey-darken-1"></v-icon>
          </div>
        </v-card>

      </v-container>

    <!-- Bottom Navigation Bar -->
    <v-bottom-navigation
      v-model="activeTab"
      grow
      bg-color="white"
      class="border-t today-navigation"
      elevation="3"
      tag="nav"
      aria-label="เมนูหลัก"
    >
      <v-btn value="today" class="text-grey-darken-4 font-weight-bold">
        <v-icon :icon="mdiCalendarToday"></v-icon>
        <span>วันนี้</span>
      </v-btn>

      <v-btn value="tasks" class="text-grey" @click="changeTab('tasks')">
        <v-icon :icon="mdiClipboardTextOutline"></v-icon>
        <span>งาน</span>
      </v-btn>

      <v-btn value="calendar" class="text-grey" @click="changeTab('calendar')">
        <v-icon :icon="mdiCalendarBlankOutline"></v-icon>
        <span>ปฏิทิน</span>
      </v-btn>

      <v-btn value="time" class="text-grey" @click="changeTab('time')">
        <v-icon :icon="mdiClockOutline"></v-icon>
        <span>เวลา</span>
      </v-btn>

      <v-btn value="notes" class="text-grey" @click="changeTab('notes')">
        <v-icon :icon="mdiBookmarkOutline"></v-icon>
        <span>บันทึก</span>
      </v-btn>
    </v-bottom-navigation>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authUser } from '../auth'
import LogoutButton from '../components/LogoutButton.vue'
import {
  mdiAlertCircle,
  mdiChevronRight,
  mdiCalendarToday,
  mdiClipboardTextOutline,
  mdiCalendarBlankOutline,
  mdiClockOutline,
  mdiBookmarkOutline,
} from '@mdi/js'

// สถานะแท็บด้านล่าง
const activeTab = ref('today')

// ฟังก์ชันรองรับการกดปุ่มต่างๆ (สามารถเชื่อมต่อ Vue Router หรือ API เพิ่มเติมได้ที่นี่)
const handleCheckIn = () => {
  console.log('คลิกเช็คเข้างาน')
}

const goToDetail = (taskId) => {
  console.log('ไปดูรายละเอียดงาน:', taskId)
}

const goToAllTasks = () => {
  console.log('ไปดูงานทั้งหมด')
}

const handleJoinMeeting = () => {
  console.log('เข้าร่วมประชุมออนไลน์')
}

const goToNotifications = () => {
  console.log('ดูรายการแจ้งเตือนทั้งหมด')
}

const changeTab = (tabName) => {
  console.log('เปลี่ยนไปที่แท็บ:', tabName)
  // ตัวอย่างเช่น หากใช้ Vue Router: router.push(`/${tabName}`)
}
</script>

<style scoped>
.today-page {
  min-height: calc(100svh - 56px);
  padding-bottom: 16px;
}

.today-navigation {
  max-width: 440px;
  margin-inline: auto;
  right: 0;
}

/* กำหนดขนาดหน้าจอจำลองแบบ Mobile View ให้แสดงผลพอดีสวยงาม */
.max-w-md {
  max-width: 440px;
  margin: 0 auto;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
