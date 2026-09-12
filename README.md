# Vaccine Guide Web Application
**หน่วยงาน:** ห้องตรวจพิเศษเด็ก 1 OPD 27 โรงพยาบาลมหาราชนครเชียงใหม่

เว็บแอปพลิเคชันแนะนำการรับวัคซีนสำหรับเด็กตามช่วงอายุ (0-48 เดือน) พร้อมระบบคำนวณราคาวัคซีนเสริมและนับจำนวนเข็มฉีดแบบ Real-time

---

## 🚀 วิธีเปิดใช้งานและทดสอบในเครื่อง (Local Test)

คุณสามารถเลือกวิธีเปิดเซิร์ฟเวอร์จำลองเพื่อทดสอบได้ 2 วิธี:

### วิธีที่ 1: ใช้ Shell Script (แนะนำสำหรับ macOS / Linux)
เปิด Terminal ในโฟลเดอร์นี้ แล้วรัน:
```bash
./run_local.sh
```

### วิธีที่ 2: ใช้ Python Script (Cross-platform)
```bash
python3 run_local.py
```

*หมายเหตุ: สคริปต์จะค้นหาพอร์ตที่ว่าง (เริ่มต้นที่ 8000) และเปิดเว็บบราวเซอร์ให้อัตโนมัติที่ `http://localhost:8000`*

---

## 📁 โครงสร้างไฟล์ในโครงการ

- **[index.html](file:///Users/neung/VACCINE%20GUIDE/index.html):** โค้ดเว็บแอปพลิเคชันหลัก (Single-File App รวม HTML, CSS, JS)
- **[run_local.sh](file:///Users/neung/VACCINE%20GUIDE/run_local.sh):** สคริปต์ Bash สำหรับรัน Local Web Server
- **[run_local.py](file:///Users/neung/VACCINE%20GUIDE/run_local.py):** สคริปต์ Python สำหรับรัน Local Web Server
- **[architecture.md](file:///Users/neung/VACCINE%20GUIDE/architecture.md):** เอกสารอธิบายโครงสร้าง สถาปัตยกรรม และตรรกะของระบบ
- **[edit.md](file:///Users/neung/VACCINE%20GUIDE/edit.md):** บันทึกประวัติการปรับปรุง แก้ไข และพัฒนา (Changelog)
