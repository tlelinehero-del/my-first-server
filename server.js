const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CR7 Quantum Cyber Card</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    height: 100vh;
    background: #020208;
    font-family: "Segoe UI", -apple-system, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    position: relative;
}

/* 🌌 พื้นหลังตารางเลเซอร์ Grid 3D */
body::before {
    content: "";
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background-image: 
        linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    transform: perspective(500px) rotateX(60deg);
    animation: gridMove 20s linear infinite;
    z-index: 1;
}

@keyframes gridMove {
    0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
    100% { transform: perspective(500px) rotateX(60deg) translateY(40px); }
}

/* ⚡ ตัวการ์ดที่มีแสงเลเซอร์วิ่งรอบตัว (Animated Gradient Border) */
.card-container {
    position: relative;
    width: 440px;
    height: 600px;
    background: #050510;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    z-index: 10;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
}

/* แสงเลเซอร์วิ่งวนรอบการ์ด */
.card-container::before {
    content: "";
    position: absolute;
    width: 150px;
    height: 140%;
    background: linear-gradient(#00f0ff, #ff007f);
    animation: laserRotate 4s linear infinite;
    z-index: 1;
}

/* ตัวทับด้านใน เพื่อบังเลเซอร์ให้เหลือแค่ขอบ */
.card-content {
    position: absolute;
    inset: 4px;
    background: rgba(10, 6, 20, 0.95);
    border-radius: 16px;
    z-index: 2;
    padding: 35px 25px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    backdrop-filter: blur(10px);
}

/* 🤖 หน้ากากโฮโลแกรมสแกนใบหน้า CR7 (CSS ล้วน) */
.hologram-avatar {
    width: 130px;
    height: 130px;
    margin: 0 auto;
    border: 2px solid #ff007f;
    border-radius: 50%;
    position: relative;
    background: radial-gradient(circle, rgba(255, 0, 127, 0.1) 0%, transparent 70%);
    box-shadow: 0 0 20px rgba(255, 0, 127, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
}

/* แถบเลเซอร์สแกนขึ้น-ลง */
.hologram-avatar::after {
    content: "";
    position: absolute;
    width: 90%;
    height: 3px;
    background: #00f0ff;
    box-shadow: 0 0 10px #00f0ff;
    animation: laserScan 2.5s ease-in-out infinite;
}

/* หน้ากากเหล็กตรงกลาง */
.mask-core {
    width: 60px;
    height: 80px;
    background: transparent;
    border: 3px solid #00f0ff;
    border-top: none;
    border-radius: 0 0 30px 30px;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 240, 255, 0.3);
}

.mask-core::before, .mask-core::after {
    content: "";
    position: absolute;
    width: 25px;
    height: 10px;
    border: 2px solid #ff007f;
    top: 15px;
}
.mask-core::before { left: -15px; border-radius: 10px 0 0 0; transform: rotate(-15deg); }
.mask-core::after { right: -15px; border-radius: 0 10px 0 0; transform: rotate(15deg); }

@keyframes laserRotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes laserScan {
    0%, 100% { top: 10%; }
    50% { top: 90%; }
}

h1 {
    font-family: 'Impact', sans-serif;
    font-size: 34px;
    margin: 15px 0 0 0;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #00f0ff, #ff007f);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.system-status {
    font-family: monospace;
    font-size: 12px;
    color: #00f0ff;
    letter-spacing: 3px;
    margin-bottom: 20px;
    text-transform: uppercase;
}

/* ดีไซน์แถบข้อมูลสไตล์ช่องไอเทมในเกม */
.data-slot {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 0, 127, 0.2);
    padding: 12px 18px;
    border-radius: 8px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    transition: 0.3s;
}

.data-slot::before {
    content: "■";
    color: #00f0ff;
    font-size: 10px;
    position: absolute;
    left: 8px;
}

.data-slot:hover {
    background: rgba(0, 240, 255, 0.08);
    border-color: #00f0ff;
    transform: translateX(5px);
}

.data-slot span {
    font-family: monospace;
    color: #777;
    font-size: 11px;
    padding-left: 10px;
}

.data-slot b {
    color: #fff;
    font-size: 18px;
    text-shadow: 0 0 5px rgba(255,255,255,0.3);
}

.footer-section {
    margin-top: 15px;
}

.jp-text {
    font-size: 14px;
    color: #aaa;
    font-style: italic;
}

/* ปุ่มกดสไตล์ Game Start */
.action-button {
    margin-top: 15px;
    background: transparent;
    border: 1px solid #ff007f;
    padding: 10px 30px;
    border-radius: 5px;
    color: #ff007f;
    font-family: "Impact", sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: 0.3s;
}

.action-button:hover {
    background: #ff007f;
    color: #000;
    box-shadow: 0 0 20px #ff007f;
    transform: scale(1.05);
}
</style>

</head>
<body>

<div class="card-container">
    <div class="card-content">
        <!-- 🤖 โลโก้สแกนใบหน้า (โฮโลแกรมขยับได้) -->
        <div class="hologram-avatar">
            <div class="mask-core"></div>
        </div>

        <div>
            <h1>THANADOL</h1>
            <div class="system-status">CR7.QUANTUM_SYS // ACTIVE</div>
        </div>

        <!-- 📊 ส่วนข้อมูลของคุณ -->
        <div class="info-group">
            <div class="data-slot">
                <span>USER_NAME</span>
                <b>ธนดล แสงทอง</b>
            </div>
            <div class="data-slot">
                <span>STUDENT_ID</span>
                <b>69319011719</b>
            </div>
        </div>

        <!-- 🏆 ท้ายการ์ด -->
        <div class="footer-section">
            <div class="jp-text">「よろしくお願いします。」</div>
            <button class="action-button">SIUUUUUU! 7</button>
        </div>
    </div>
</div>

</body>
</html>
    `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Quantum Cyber Server is running on port ${PORT}`);
});
