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
  <html lang="th">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>🎮 GAME SERVER - ONLINE</title>
      <style>
          * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
          }

          body {
              background: radial-gradient(circle at center, #0f172a 0%, #020617 100%);
              color: #f8fafc;
              font-family: 'Segoe UI', Roboto, Helvetica, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              overflow: hidden;
          }

          /* ตารางกริดพื้นหลังแบบเกม Sci-Fi */
          body::before {
              content: "";
              position: absolute;
              width: 200%;
              height: 200%;
              top: -50%;
              left: -50%;
              background-image: 
                  linear-gradient(rgba(0, 255, 204, 0.03) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 204, 0.03) 1px, transparent 1px);
              background-size: 30px 30px;
              transform: perspective(500px) rotateX(60deg);
              z-index: 1;
              animation: gridMove 20s linear infinite;
          }

          @keyframes gridMove {
              0% { background-position: 0 0; }
              100% { background-position: 0 100%; }
          }

          /* กล่อง Dashboard นีออน */
          .game-card {
              position: relative;
              width: 90%;
              max-width: 650px;
              background: rgba(15, 23, 42, 0.9);
              border: 3px solid #00ffcc;
              border-radius: 20px;
              padding: 40px;
              text-align: center;
              box-shadow: 0 0 30px rgba(0, 255, 204, 0.3), inset 0 0 15px rgba(0, 255, 204, 0.1);
              backdrop-filter: blur(10px);
              z-index: 10;
          }

          /* เอฟเฟกต์จอแก้วเก่า (Scanlines) */
          .game-card::after {
              content: " ";
              display: block;
              position: absolute;
              top: 0; left: 0; bottom: 0; right: 0;
              background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%);
              z-index: 11;
              background-size: 100% 4px;
              pointer-events: none;
              border-radius: 17px;
          }

          h1 {
              font-size: 2.5rem;
              font-weight: 900;
              color: #00ffcc;
              text-shadow: 0 0 10px rgba(0, 255, 204, 0.6), 0 0 20px rgba(0, 255, 204, 0.2);
              letter-spacing: 2px;
              margin-bottom: 25px;
          }

          .player-info {
              background: rgba(2, 6, 17, 0.8);
              border: 1px solid rgba(0, 255, 204, 0.4);
              border-radius: 10px;
              padding: 20px;
              margin-bottom: 25px;
          }

          h2 {
              color: #38bdf8;
              font-size: 1.8rem;
              margin-bottom: 8px;
              text-shadow: 0 0 8px rgba(56, 189, 248, 0.3);
          }

          .student-id {
              font-family: 'Courier New', Courier, monospace;
              color: #94a3b8;
              font-size: 1.1rem;
              letter-spacing: 2px;
          }

          .status-text {
              color: #cbd5e1;
              font-size: 1.1rem;
              line-height: 1.6;
              margin-bottom: 30px;
          }

          /* ไฟกระพริบ Online */
          .status-badge {
              display: inline-flex;
              align-items: center;
              gap: 10px;
              background: rgba(0, 255, 102, 0.1);
              border: 1px solid #00ff66;
              color: #00ff66;
              padding: 10px 24px;
              border-radius: 50px;
              font-weight: bold;
              font-size: 1.1rem;
              letter-spacing: 1.5px;
              box-shadow: 0 0 15px rgba(0, 255, 102, 0.2);
              animation: pulse 1.5s infinite alternate;
          }

          @keyframes pulse {
              0% { box-shadow: 0 0 10px rgba(0, 255, 102, 0.2); }
              100% { box-shadow: 0 0 25px rgba(0, 255, 102, 0.6); }
          }

          .dot {
              width: 10px;
              height: 10px;
              background-color: #00ff66;
              border-radius: 50%;
              box-shadow: 0 0 8px #00ff66;
          }
      </style>
  </head>
  <body>

      <div class="game-card">
          <h1>🎮 GAME SERVER 🎮</h1>

          <div class="player-info">
              <h2>ธนดล แสงทอง</h2>
              <p class="student-id">รหัสนักศึกษา: 69319011719</p>
          </div>

          <p class="status-text">เครื่องแม่ข่ายทำงานปกติบนระบบ Railway แล้วครับผม!</p>

          <div class="status-badge">
              <span class="dot"></span>
              SERVER ONLINE
          </div>
      </div>

  </body>
  </html>
  `);
});

// 4. สั่งให้เซิร์ฟเวอร์เริ่มต้นเปิดรับฟังการเชื่อมต่อตาม Port ที่กำหนดไว้
server.listen(port, () => {
  console.log(`Server is running! เครื่องแม่ข่ายเปิดทำงานแล้วที่ช่องทาง: ${port}`);
});
