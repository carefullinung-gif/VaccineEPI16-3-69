# คู่มือการบันทึกและส่งโค้ดขึ้น GitHub (Git & GitHub Workflow Guide)
**โครงการ:** Vaccine Guide Web Application  
**หน่วยงาน:** ห้องตรวจพิเศษเด็ก 1 OPD 27 โรงพยาบาลมหาราชนครเชียงใหม่  

---

## 📌 สรุปลิงก์สำคัญประจำโครงการ
- **GitHub Repository:** [https://github.com/carefullinung-gif/VaccineEPI16-3-69](https://github.com/carefullinung-gif/VaccineEPI16-3-69)
- **เว็บไซต์ออนไลน์ (GitHub Pages):** [https://carefullinung-gif.github.io/VaccineEPI16-3-69/](https://carefullinung-gif.github.io/VaccineEPI16-3-69/)
- **หน้าเช็กสถานะการอัปเดตเว็บ (GitHub Actions):** [https://github.com/carefullinung-gif/VaccineEPI16-3-69/actions](https://github.com/carefullinung-gif/VaccineEPI16-3-69/actions)

---

## 🚀 1. ขั้นตอนการ Push โค้ดขึ้น GitHub (เมื่อแก้ไขไฟล์แล้ว)

เมื่อมีการแก้ไขโค้ด เช่น แก้ไข `index.html` หรือเพิ่มข้อมูลวัคซีน คุณสามารถเลือกทำได้ 2 วิธี:

### วิธีที่ 1: สั่งผ่าน Antigravity (สะดวกที่สุด) 💬
พิมพ์ข้อความสั่งในช่องแชทของ Antigravity ได้เลย เช่น:
> *"push ขึ้น github ให้หน่อย"*  
> หรือ  
> *"commit อัปเดตราคาวัคซีน แล้ว push เลย"*

ระบบจะช่วยประมวลผลคำสั่ง `git add`, `git commit` และ `git push` ให้โดยอัตโนมัติ

---

### วิธีที่ 2: พิมพ์คำสั่งผ่าน Terminal ด้วยตนเอง 💻
เปิดแอป **Terminal** บนเครื่อง Mac แล้วใช้เพียง 3 คำสั่งหลัก:

```bash
# 1. เข้าไปที่โฟลเดอร์ของโครงการ
cd "/Users/neung/VACCINE GUIDE"

# 2. เพิ่มไฟล์ทั้งหมดที่แก้ไขเข้าสู่ระบบเตรียมส่ง
git add .

# 3. บันทึกคำอธิบายการแก้ไข (เปลี่ยนข้อความในเครื่องหมายคำพูดตามต้องการ)
git commit -m "อัปเดตข้อมูลวัคซีนและปรับปรุงหน้าตา UI"

# 4. ส่งไฟล์ขึ้น GitHub
git push
```

---

## 🔑 2. การตั้งค่าระบบจำรหัสผ่าน (ไม่ต้องใส่ Token ซ้ำ)

เพื่อป้องกันไม่ให้ GitHub ถามรหัสผ่านหรือ Token ทุกครั้งที่ push ให้ตั้งค่า macOS Keychain เพียงครั้งเดียว:

```bash
git config --global credential.helper osxkeychain
```

เมื่อตั้งค่านี้แล้ว ในครั้งแรกที่ระบบถาม Token ให้ใส่ตามปกติ จากนั้นเครื่อง Mac จะจำข้อมูลการล็อกอินไว้ในระบบความปลอดภัย (Keychain) ของเครื่องอย่างถาวร

---

## 🎟️ 3. วิธีขอ Personal Access Token (กรณี Token เดิมหมดอายุ)

เนื่องจาก GitHub ไม่อนุญาตให้ใช้รหัสผ่านทั่วไป หากต้องสร้าง Token ใหม่ มีขั้นตอนดังนี้:

1. คลิกที่ลิงก์ลัด: [สร้าง GitHub Token แบบเลือกสิทธิ์ให้อัตโนมัติ](https://github.com/settings/tokens/new?scopes=repo&description=VaccineGuideToken)
2. กำหนดอายุการใช้งานในช่อง **Expiration** (เช่น 90 days หรือ No expiration ตามต้องการ)
3. เลื่อนลงล่างสุด คลิกปุ่มสีเขียว **"Generate token"**
4. **คัดลอกรหัส Token** (ขึ้นต้นด้วย `ghp_...`) เก็บไว้ในที่ปลอดภัย
5. เมื่อ Terminal ถามรหัสผ่าน ให้วาง Token นี้แทน Password

---

## 🛠️ 4. ปัญหาที่พบบ่อยและวิธีแก้ไข (Troubleshooting)

### ❓ ปัญหาที่ 1: Push ขึ้นแล้ว แต่หน้าเว็บออนไลน์ยังเป็นเวอร์ชันเดิม
* **สาเหตุ:** เบราว์เซอร์ในเครื่องหรือมือถือจดจำแคช (Cache) ของหน้าเว็บเดิมไว้
* **วิธีแก้:**
  - **เครื่อง Mac:** กดปุ่ม `Cmd` + `Shift` + `R` (Hard Reload)
  - **เครื่อง Windows:** กดปุ่ม `Ctrl` + `F5`
  - **บนมือถือ (iPhone/Android):** ลองเปิดใน **โหมดไม่ระบุตัวตน (Private/Incognito Mode)**

### ❓ ปัญหาที่ 2: ติดสิทธิ์ Xcode License (`code 69`)
* **สาเหตุ:** macOS มีการอัปเดตระบบ ทำให้สิทธิ์ Git หลุด
* **วิธีแก้:** เปิด Terminal แล้วรันคำสั่ง:
  ```bash
  sudo xcodebuild -license accept
  ```
  จากนั้นใส่รหัสผ่านเครื่อง Mac แล้วกด Enter

### ❓ ปัญหาที่ 3: ขึ้นข้อความ `Authentication failed`
* **สาเหตุ:** ใส่รหัสผ่านผิด หรือ Token หมดอายุ
* **วิธีแก้:** ให้สร้าง Token ใหม่ตามขั้นตอนในหัวข้อที่ 3 แล้วนำมาวางแทนรหัสผ่าน
