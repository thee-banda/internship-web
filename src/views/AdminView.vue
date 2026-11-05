<template>
  <v-app class="bg-grey-lighten-4">
    <!-- Navigation Drawer (Sidebar) -->
    <v-navigation-drawer v-model="drawer" permanent width="280" class="border-e">
      <div class="pa-6">
        <h2 class="text-h6 font-weight-bold">ฝึกงาน</h2>
        <p class="text-caption text-grey-darken-1">พื้นที่สำหรับผู้ดูแล</p>
      </div>

      <v-list class="px-3" density="comfortable">
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :value="item"
          :active="item.active"
          rounded="lg"
          class="mb-1"
          @click="selectedMenu = item.title"
        >
          <v-list-item-title class="font-weight-medium">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4 border-t">
          <div class="font-weight-bold text-subtitle-2">อ.กมล • ผู้ดูแล</div>
          <div class="text-caption text-grey">ภาคเรียน 2 / 2569</div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-8">
        
        <!-- Header Section -->
        <div class="mb-6">
          <h1 class="text-h4 font-weight-bold mb-1">ภาพรวมการฝึกงาน</h1>
          <p class="text-body-2 text-grey-darken-1">
            29 ตุลาคม 2569 • ข้อมูลตัวอย่างสำหรับทดสอบ
          </p>
        </div>

        <!-- Metric Cards -->
        <v-row class="mb-6">
          <v-col cols="12" md="4">
            <v-card flat border class="pa-5 rounded-lg h-100">
              <div class="text-subtitle-2 text-grey-darken-2 mb-2">นักศึกษาที่ดูแล</div>
              <div class="text-h5 font-weight-bold">12 คน</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card flat border class="pa-5 rounded-lg h-100">
              <div class="text-subtitle-2 text-grey-darken-2 mb-2">งานเกินกำหนด</div>
              <div class="text-h5 font-weight-bold">3 งาน / 2 คน</div>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card flat border class="pa-5 rounded-lg h-100">
              <div class="text-subtitle-2 text-grey-darken-2 mb-2">เวลาไม่ครบ</div>
              <div class="text-h5 font-weight-bold">2 คน / 2 วัน</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Alert Banner -->
        <v-card flat border class="pa-4 mb-6 rounded-lg bg-white">
          <div class="text-body-2 font-weight-medium text-grey-darken-3">
            <span class="text-error font-weight-bold">! ต้องติดตามวันนี้</span> 
            2 คนมีงานเกินกำหนด • 2 คนบันทึกเวลาไม่ครบ • 1 คำขอรออนุมัติ
          </div>
        </v-card>

        <!-- Students Table Section -->
        <v-card flat border class="mb-6 rounded-lg">
          <div class="d-flex justify-space-between align-center pa-4 border-b">
            <h3 class="text-h6 font-weight-bold">นักศึกษาที่รับผิดชอบ</h3>
            <v-btn variant="outlined" density="comfortable" class="text-none" rounded="lg">
              คำขอแก้ไขเวลา (1)
            </v-btn>
          </div>

          <v-table>
            <thead>
              <tr class="text-grey-darken-1">
                <th class="font-weight-bold">นักศึกษา / สถานประกอบการ</th>
                <th class="font-weight-bold">งานเสร็จ</th>
                <th class="font-weight-bold">ชั่วโมงสะสม</th>
                <th class="font-weight-bold">ประเด็นติดตาม</th>
                <th class="font-weight-bold text-end">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, index) in students" :key="index">
                <td>
                  <div class="font-weight-bold text-body-2">{{ student.name }}</div>
                  <div class="text-caption text-grey-darken-1">{{ student.company }}</div>
                </td>
                <td>{{ student.tasksCompleted }}</td>
                <td>{{ student.hours }}</td>
                <td>
                  <span :class="student.issueType === 'alert' ? 'text-error font-weight-medium' : ''">
                    {{ student.issue }}
                  </span>
                </td>
                <td class="text-end">
                  <v-btn
                    variant="outlined"
                    density="compact"
                    class="text-none px-4"
                    rounded="lg"
                    @click="viewDetail(student)"
                  >
                    ดูข้อมูล
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <!-- Upcoming Meeting Card -->
        <v-card flat border class="pa-5 rounded-lg d-flex justify-space-between align-center">
          <div>
            <div class="text-subtitle-1 font-weight-bold mb-1">
              ประชุมถัดไป • วันนี้ 10:00–10:30 น.
            </div>
            <div class="text-body-2 text-grey-darken-1">
              ประชุมติดตามประจำสัปดาห์ • นภัส / พี่เลี้ยง
            </div>
          </div>
          <v-btn color="black" class="text-none px-6" rounded="lg" flat>
            นัดประชุมเพิ่มเติม
          </v-btn>
        </v-card>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(true)
const selectedMenu = ref('ภาพรวม')

const menuItems = [
  { title: 'ภาพรวม', active: true },
  { title: 'นักศึกษา', active: false },
  { title: 'มอบหมายงาน', active: false },
  { title: 'นัดประชุม', active: false },
  { title: 'คำขอแก้ไขเวลา', active: false },
]

const students = ref([
  {
    name: 'นภัส วัฒนกุล',
    company: 'บริษัท สมมติ ดิจิทัล',
    tasksCompleted: '1 / 3',
    hours: '312 / 640',
    issue: '! งานค้าง / เวลาไม่ครบ',
    issueType: 'alert'
  },
  {
    name: 'ธนา ใจดี',
    company: 'บริษัท ตัวอย่าง เทค',
    tasksCompleted: '8 / 10',
    hours: '328 / 640',
    issue: '! งานค้าง 1 งาน',
    issueType: 'alert'
  },
  {
    name: 'ปิยะพร รุ่งเรือง',
    company: 'บริษัท สมมติ ดิจิทัล',
    tasksCompleted: '7 / 7',
    hours: '320 / 640',
    issue: 'ปกติ',
    issueType: 'normal'
  }
])

const viewDetail = (student) => {
  console.log('View details for:', student.name)
}
</script>

<style scoped>
/* ปรับแต่งเพิ่มเติมตามความเหมาะสม */
</style>