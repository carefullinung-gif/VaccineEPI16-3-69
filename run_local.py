#!/usr/bin/env python3
"""
Vaccine Guide - Local Development Server
รันเซิร์ฟเวอร์จำลองสำหรับทดสอบระบบบนเครื่อง Local
"""

import http.server
import socketserver
import webbrowser
import socket
import os
import sys

def find_available_port(start_port=8000, max_port=8099):
    """ค้นหาพอร์ตที่ว่างตั้งแต่ start_port เป็นต้นไป"""
    for port in range(start_port, max_port + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
    return start_port

def main():
    # เปลี่ยน working directory ไปยังโฟลเดอร์ของไฟล์นี้
    base_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(base_dir)

    port = find_available_port(8000)
    url = f"http://localhost:{port}"

    handler = http.server.SimpleHTTPRequestHandler
    socketserver.TCPServer.allow_reuse_address = True

    print("=" * 60)
    print(" 🏥 Vaccine Guide Web Application - Local Server")
    print("=" * 60)
    print(f" 🌐 URL: {url}")
    print(" 📂 Root Directory:", base_dir)
    print(" ⌨️  กด Ctrl + C เพื่อหยุดการทำงานของเซิร์ฟเวอร์")
    print("=" * 60)

    try:
        # เปิดเว็บบราวเซอร์อัตโนมัติ
        webbrowser.open(url)
        
        with socketserver.TCPServer(("127.0.0.1", port), handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 หยุดการทำงานของเซิร์ฟเวอร์เรียบร้อยแล้ว ขอบคุณครับ!")
        sys.exit(0)

if __name__ == "__main__":
    main()
