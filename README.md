# Internship Web

เว็บตัวอย่างระบบจัดการฝึกงานด้วย **Vue 3 + Vuetify 4 + Vue Router + Vite + Express 5** เขียนด้วย JavaScript แบบ ES Modules ใช้ฟอนต์ Noto Sans Thai ที่รวมอยู่ในโปรเจกต์

## บัญชีตัวอย่าง

กรอก **รหัสประจำตัวอย่างเดียว ไม่ใช้รหัสผ่าน** บัญชีถูกตรวจใน Express และเลือกบทบาทจากข้อมูลฝั่งเซิร์ฟเวอร์

| ผู้ใช้ | รหัส | บทบาท | หน้าปลายทาง |
| --- | --- | --- | --- |
| นภัส วัฒนกุล | `65000001` | `student` | `/today` |
| อ.กมล | `T001` | `teacher` | `/admin` |

รหัสเป็นข้อความเพื่อรักษาเลขศูนย์ด้านหน้า รองรับการเว้นวรรคหัวท้ายและตัวอักษรเล็ก เช่น `t001` จะแปลงเป็น `T001` ก่อนตรวจ แสดงบัญชีตัวอย่างไว้ใต้ฟอร์มด้วย

## เริ่มใช้งาน

ใช้ Node.js 22.12 ขึ้นไป แล้วรัน:

```sh
npm ci
npm run dev
```

เปิด <http://127.0.0.1:5173/login> คำสั่งเดียวเปิด Vite ที่พอร์ต 5173 และ Express ที่พอร์ต 3000 โดย proxy `/api` ไป Express ต้องรันทั้งสองส่วนจึงจะเข้าสู่ระบบได้

รันเว็บหลัง build โดยหยุดโหมดพัฒนาด้วย Ctrl+C ก่อน:

```sh
npm run build
npm start
```

เปิด <http://127.0.0.1:3000/login> Express รองรับการเปิดหรือรีเฟรช `/today` และ `/admin` โดยตรง Vue Router จะตรวจ session ก่อนแสดงหน้า

เปลี่ยนเซิร์ฟเวอร์ด้วย environment variables `HOST` และ `PORT` (ค่าเริ่มต้น `127.0.0.1:3000`) กำหนด `SESSION_SECRET` ผ่าน environment ได้ หากไม่กำหนดจะสุ่มเมื่อเริ่ม Express ไม่เก็บ secret ลง repository

## Session และการเปลี่ยนหน้า

- ใช้ `express-session` พร้อม MemoryStore ไม่มีฐานข้อมูล เก็บข้อมูล session ฝั่ง Express และเก็บเฉพาะ session ID ใน cookie
- cookie ชื่อ `internship.sid` ใช้ `HttpOnly`, `SameSite=Lax`, `secure: 'auto'` ซึ่งใช้ Secure เมื่อเชื่อมต่อ HTTPS โดยตรง
- อายุ session ปกติ 8 ชั่วโมง; เลือกจดจำการเข้าสู่ระบบเป็น 7 วัน รีเฟรชหน้าแล้วอ่านบัญชีจาก `/api/auth/me`
- session อยู่ในหน่วยความจำและหายเมื่อรีสตาร์ต Express จึงต้องเข้าสู่ระบบใหม่แม้เลือกจดจำไว้
- ยังไม่เข้าสู่ระบบจะกลับ `/login`; นักศึกษาเข้าได้เฉพาะ Today และอาจารย์เข้าได้เฉพาะ Admin หากเข้าผิดบทบาทจะกลับหน้าหลักของตัวเอง
- เปิด Login ขณะมี session จะไปหน้าหลักของตัวเอง ปุ่มออกจากระบบจะลบ session และ cookie ก่อนกลับ Login
- ไม่เก็บรหัสหรือบทบาทลง localStorage/sessionStorage และไม่บันทึกข้อมูลเข้าสู่ระบบลง console
- ระบบนี้ใช้บัญชีสาธิตที่เปิดเผยไว้ ไม่ใช่การพิสูจน์ตัวตนสำหรับบัญชีจริง ข้อมูลการฝึกงานบนหน้าเว็บยังเป็นข้อมูลตัวอย่าง
- Sidebar อาจารย์แสดงถาวรตั้งแต่ 960 px และเปิด/ปิดด้วยปุ่มเมนูบนมือถือ
- ปุ่มงาน ลงเวลา ประชุม และฟังก์ชันอื่นบน Today/Admin ยังเป็น placeholder ตามต้นแบบ

## API

| Method | URL | การทำงาน |
| --- | --- | --- |
| GET | `/api/health` | ตอบ `{ "status": "ok" }` |
| POST | `/api/auth/login` | รับ `{ "code": "65000001", "remember": false }` สร้าง session ใหม่และตอบ `{ "user": { "code": "65000001", "name": "นภัส วัฒนกุล", "role": "student" } }` |
| GET | `/api/auth/me` | ตอบ user จาก session หรือ `401` |
| POST | `/api/auth/logout` | ลบ session และ cookie ตอบ `204` |

Login ตอบ `400` เมื่อรหัสหาย/ไม่ใช่ข้อความ หรือ remember ไม่ใช่ boolean และ `401` เมื่อไม่พบรหัส ไม่รับสิทธิ์จาก `role` ที่ส่งใน request การตอบข้อมูลบัญชีใช้ `Cache-Control: no-store` ส่วน API อื่นตอบ `404`

## โครงสร้าง

```text
src/
  main.js                    Router, route guards และ Vuetify
  auth.js                    การเรียก API และสถานะผู้ใช้ใน Vue
  App.vue                    โครงแอปกลาง
  components/LogoutButton.vue ปุ่มออกจากระบบร่วมกัน
  views/LoginView.vue        ฟอร์มรหัสประจำตัว
  views/TodayView.vue        หน้านักศึกษา
  views/AdminView.vue        หน้าอาจารย์
  styles.css                 รูปแบบหน้า Login
server/
  app.js                     บัญชีตัวอย่าง, session, API และ static server
  index.js                   เริ่ม Express
tests/auth.test.js           Integration tests สำหรับ auth API
```

## ตรวจการทำงาน

```sh
npm test
npm run build
```

Tests ตรวจข้อมูลไม่ครบ รหัสไม่พบ บทบาทจากเซิร์ฟเวอร์ อายุและคุณสมบัติ cookie การเปลี่ยน session ID การหมดอายุ และ logout

ตรวจในเบราว์เซอร์เพิ่มเติม: ลองทั้งสองบัญชีด้วยปุ่มและ Enter, เปิดหน้าผิดบทบาท, รีเฟรช, เปิด Login ขณะมี session, logout แล้วเปิดหน้าที่ต้องเข้าสู่ระบบอีกครั้ง รวมถึง Sidebar อาจารย์ที่ 390/1440 px หาก Express ไม่พร้อม ฟอร์มจะแสดง “เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่” และไม่เข้าสู่หน้าที่ต้องใช้ session

ไม่มีการตั้งค่า hosting ในรอบนี้
