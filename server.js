const http = require('http');

const server = http.createServer((req, res) => {
    // กำหนดให้ส่งข้อมูลกลับไปเป็นหน้าเว็บ HTML และรองรับภาษาไทย/ญี่ปุ่น (utf-8)
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    // โค้ด HTML/CSS ดีไซน์การ์ดแนะนำตัวธีม CR7 ฟุตบอลสุดเท่
    res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<title>CR7 Style Profile</title>

<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    /* ไล่เฉดสีดำ-แดงสปอร์ตเรืองแสง */
    background: radial-gradient(circle, #1c0205 0%, #0a0002 100%);
    font-family: "Segoe UI", "Helvetica Neue", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    color: white;
}

.card {
    width: 420px;
    background: rgba(10, 5, 5, 0.85);
    border: 3px solid #e51b23;
    border-radius: 25px;
    padding: 30px;
    text-align: center;
    /* แสงนีออนสีแดงรอบการ์ด */
    box-shadow: 0 0 30px rgba(229, 27, 35, 0.6);
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
    backdrop-filter: blur(10px);
}

.card:hover {
    transform: translateY(-8px);
    box-shadow: 0 0 45px rgba(229, 27, 35, 0.9);
}

/* สัญลักษณ์เลข 7 สไตล์ CR7 */
.badge-7 {
    width: 75px;
    height: 75px;
    background: linear-gradient(135deg, #e51b23, #b30f15);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Impact", sans-serif;
    font-size: 36px;
    font-weight: bold;
    margin: 0 auto 15px auto;
    box-shadow: 0 0 15px rgba(229, 27, 35, 0.8);
    border: 2px solid #fff;
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
    margin-bottom: 20px;
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
    margin: 25px auto;
}

.footer {
    color: #ffb3c1;
    font-style: italic;
    line-height: 1.6;
}

.siu-text {
    font-family: "Impact", sans-serif;
    color: #ffd700; /* สีทองแชมเปียน */
    font-size: 20px;
    letter-spacing: 2px;
    margin-top: 10px;
    display: block;
}
</style>

</head>
<body>

<div class="card">
    <!-- โลโก้เลข 7 สุดเท่ -->
    <div class="badge-7">7</div>
    
    <h1>自己紹介</h1>
    <div class="jp-sub">Jikoshoukai (แนะนำตัว)</div>

    <div class="line"></div>

    <!-- ข้อมูลแนะนำตัวของคุณเหมือนเดิมครบถ้วน -->
    <div class="info"><span>👤 ชื่อ :</span> <b>ธนดล แสงทอง</b></div>
    <div class="info"><span>🎓 รหัส :</span> <b>69319011719</b></div>

    <div class="line"></div>

    <div class="footer">
        「よろしくお願いします。」
        <br>
        Yoroshiku Onegaishimasu
        <span class="siu-text">🏆 SIUUUUUUU! 🏆</span>
    </div>
</div>

</body>
</html>
    `);
});

// ให้เซิร์ฟเวอร์รันบน Port ที่ Railway กำหนดให้
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running beautifully on port ${PORT}`);
});
