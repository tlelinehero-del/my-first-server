const http = require('http');

const server = http.createServer((req, res) => {
    // กำหนดให้ส่งข้อมูลกลับไปเป็นหน้าเว็บ HTML และรองรับภาษาไทย/ญี่ปุ่น (utf-8)
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    // โค้ด HTML/CSS ระบบแสดงผลแบบเสถียรที่สุด ไม่ดำ ไม่พัง แน่นอน
    res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>CR7 Meme Style Profile</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    /* พื้นหลังเฉดสีดำ-แดงดุดัน สไตล์สปอร์ต */
    background: radial-gradient(circle, #1c0205 0%, #0a0002 100%);
    font-family: "Segoe UI", "Helvetica Neue", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: white;
    padding: 20px;
}

.card {
    width: 450px;
    background: rgba(10, 5, 5, 0.9);
    border: 3px solid #e51b23;
    border-radius: 25px;
    padding: 40px 30px 30px 30px;
    text-align: center;
    /* แสงนีออนสีแดงรอบการ์ด */
    box-shadow: 0 0 30px rgba(229, 27, 35, 0.6);
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
    backdrop-filter: blur(10px);
    position: relative;
    overflow: hidden;
}

.card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 0 50px rgba(229, 27, 35, 1);
}

/* ธงชาติไทยมุมซ้ายบนแบบ CSS Code (ไม่มีวันแตก ไม่มีวันดำเพราะไม่ต้องดึงรูปนอกเว็บ) */
.flag-thailand {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 45px;
    height: 30px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.6);
    z-index: 10;
    background: linear-gradient(
        to bottom,
        #a51931 0%, #a51931 16.6%,
        #f4f5f8 16.6%, #f4f5f8 33.3%,
        #2d2a4a 33.3%, #2d2a4a 66.6%,
        #f4f5f8 66.6%, #f4f5f8 83.3%,
        #a51931 83.3%, #a51931 100%
    );
}

/* 🎬 ภาพมีมโรนัลโด้ SIUUUU จากเซิร์ฟเวอร์สำรองที่เสถียรที่สุด */
.meme-profile {
    width: 240px;
    height: 170px;
    object-fit: cover;
    border-radius: 15px;
    border: 4px solid #fff;
    margin: 10px auto 20px auto;
    display: block;
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.8);
    transition: transform 0.2s ease-in-out;
}

.card:hover .meme-profile {
    animation: memeShake 0.5s;
    animation-iteration-count: infinite;
}

@keyframes memeShake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}

h1 {
    color: #e51b23;
    font-family: "Impact", "Segoe UI", sans-serif;
    font-size: 38px;
    margin: 0;
    letter-spacing: 2px;
    text-shadow: 0 0 10px rgba(229, 27, 35, 0.5);
}

.jp-sub {
    color: #ffffff;
    font-size: 18px;
    margin-top: 5px;
    margin-bottom: 25px;
    opacity: 0.9;
}

.info {
    font-size: 20px;
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
    padding: 12px 18px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border-left: 5px solid #e51b23;
    text-align: left;
}

.info span {
    color: #ccc;
}

.info b {
    color: #fff;
}

.line {
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e51b23, transparent);
    margin: 30px auto;
}

.footer {
    color: #ffb3c1;
    font-style: italic;
    line-height: 1.6;
}

.siu-text {
    font-family: "Impact", sans-serif;
    color: #ffd700;
    font-size: 32px;
    letter-spacing: 3px;
    margin-top: 15px;
    display: block;
    text-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
    transform: rotate(-5deg);
}
</style>

</head>
<body>

<div class="card">
    <!-- 🇹🇭 ธงชาติไทยที่วาดด้วย CSS เกรดดีที่สุด (ไม่พึ่งพาไฟล์ภาพภายนอก ไม่มีทางเป็นภาพดำ) -->
    <div class="flag-thailand"></div>

    <!-- 🎬 มีม GIF แบบลิงก์สำรองคุณภาพสูงของ Dev (แสดงผลได้ทั่วโลก) -->
    <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Vmb3M3MXR1Z2o2djF4MHpzeHptanY4NHozcTFlZnR1dHhyeXNzbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/r1IMdmkhWpZyM/giphy.gif" alt="Ronaldo SIU Meme" class="meme-profile">
    
    <h1>自己紹介</h1>
    <div class="jp-sub">Jikoshoukai (แนะนำตัว)</div>

    <div class="line"></div>

    <!-- ข้อมูลแนะนำตัวของคุณ -->
    <div class="info"><span>👤 ชื่อ :</span> <b>ธนดล แสงทอง</b></div>
    <div class="info"><span>🎓 รหัส :</span> <b>69319011719</b></div>

    <div class="line"></div>

    <div class="footer">
        「よろしくお願いします。」
        <br>
        Yoroshiku Onegaishimasu
        <span class="siu-text">SIUUUUUUU!</span>
    </div>
</div>

</body>
</html>
    `);
});

// ให้เซิร์ฟเวอร์รันบน Port ที่ Railway กำหนดให้
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Meme Server is running beautifully on port ${PORT}`);
});
