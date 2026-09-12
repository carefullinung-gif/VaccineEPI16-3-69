#!/bin/bash
# Vaccine Guide - Local Development Server

cd "$(dirname "$0")"

PORT=8000

# ตรวจสอบหาพอร์ตที่ว่าง
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; do
    PORT=$((PORT+1))
done

URL="http://localhost:$PORT"

echo "========================================================"
echo " 🏥 Vaccine Guide Web Application - Local Server"
echo "========================================================"
echo " 🌐 URL: $URL"
echo " ⌨️  กด Ctrl + C เพื่อหยุดการทำงานของเซิร์ฟเวอร์"
echo "========================================================"

# เปิดเว็บบราวเซอร์อัตโนมัติบน macOS
open "$URL" 2>/dev/null || true

# เริ่มต้นเซิร์ฟเวอร์ HTTP ผ่าน Python 3
python3 -m http.server $PORT --bind 127.0.0.1
