// 1. เรียกใช้งาน Module ที่ชื่อว่า 'http' ซึ่งเป็นระบบพื้นฐานของ Node.js สำหรับทำเซิร์ฟเวอร์
const http = require('http');

// 2. กำหนดช่องทาง (Port) ที่เซิร์ฟเวอร์จะใช้สื่อสาร โดยให้ใช้ของที่ Cloud กำหนดมา (process.env.PORT) ถ้าไม่มีให้ใช้ 3000
const port = process.env.PORT || 3000;

// 3. สร้างเครื่องแม่ข่าย (Server) ที่คอยรับคำขอ (req) และตอบกลับ (res)
const server = http.createServer((req, res) => {

  // 3.1 ตั้งรหัสสถานะ 200 หมายถึง "ทำงานสำเร็จ (OK)"
  res.statusCode = 200;

  // 3.2 บอกเบราว์เซอร์ของผู้ใช้ว่า สิ่งที่ส่งกลับไปคือไฟล์ข้อความแบบ HTML และรองรับภาษาไทย (utf-8)
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  // 3.3 ส่งข้อมูลหน้าเว็บกลับไปหาผู้ใช้
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Game Server</title>
        <style>
            body {
                background-color: #020617;
                color: #00ffcc;
                font-family: Arial, sans-serif;
                text-align: center;
                padding-top: 100px;
            }
            .container {
                display: inline-block;
                border: 2px solid #00ffcc;
                padding: 30px;
                border-radius: 10px;
                background-color: #0f172a;
                box-shadow: 0 0 15px #00ffcc;
            }
            h1 { color: #00ffcc; }
            h2 { color: #38bdf8; }
            .status { color: #00ff66; font-weight: bold; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎮 GAME SERVER 🎮</h1>
            <h2>ธนดล แสงทอง</h2>
            <p>รหัสนักศึกษา : 69319011719</p>
            <p>เครื่องแม่ข่ายทำงานปกติบนระบบ Railway แล้วครับผม!</p>
            <p class="status">🟢 SERVER ONLINE</p>
        </div>
    </body>
    </html>
  `);
});

// 4. สั่งให้เซิร์ฟเวอร์เริ่มต้นเปิดรับฟังการเชื่อมต่อตาม Port ที่กำหนดไว้
server.listen(port, () => {
  console.log(`Server is running! เครื่องแม่ข่ายเปิดทำงานแล้วที่ช่องทาง: ${port}`);
});
