const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    
    res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CR7 Quantum Profile & Mini-Game</title>

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

/* ⚡ ตัวการ์ดแบบ 3D Flip (สลับโหมดโปรไฟล์ / เกม) */
.card-wrapper {
    perspective: 1000px;
    z-index: 10;
}

.card-inner {
    width: 440px;
    height: 620px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* เมื่อสลับโหมดจะหมุนการ์ด */
.card-inner.flipped {
    transform: rotateY(180deg);
}

/* สไตล์พื้นฐานทั้งหน้าและหลังการ์ด */
.card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 20px;
    overflow: hidden;
    background: #050510;
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
}

/* ขอบเลเซอร์วิ่งรอบตัวการ์ด */
.card-face::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(#00f0ff, #ff007f, #00f0ff);
    animation: laserRotate 4s linear infinite;
    z-index: 1;
}

.card-content {
    position: absolute;
    inset: 4px;
    background: rgba(10, 6, 20, 0.96);
    border-radius: 16px;
    z-index: 2;
    padding: 35px 25px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    backdrop-filter: blur(10px);
}

@keyframes laserRotate {
    100% { transform: rotate(360deg); }
}

/* ================= FRONT: PROFILE PAGE ================= */
.front-card {
    transform: rotateY(0deg);
}

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

.hologram-avatar::after {
    content: "";
    position: absolute;
    width: 90%;
    height: 3px;
    background: #00f0ff;
    box-shadow: 0 0 10px #00f0ff;
    animation: laserScan 2.5s ease-in-out infinite;
}

.mask-core {
    width: 60px;
    height: 80px;
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
    font-size: 11px;
    color: #00f0ff;
    letter-spacing: 3px;
    margin-bottom: 20px;
}

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
}

/* ================= BACK: GAME PAGE ================= */
.back-card {
    transform: rotateY(180deg);
}

.game-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #00f0ff;
    font-family: monospace;
    font-size: 14px;
    border-bottom: 1px solid rgba(0, 240, 255, 0.2);
    padding-bottom: 10px;
    margin-bottom: 10px;
}

/* ผืนผ้าใบเดาะบอล */
#gameCanvas {
    background: #03030b;
    border: 2px solid rgba(255, 0, 127, 0.4);
    border-radius: 10px;
    cursor: crosshair;
    display: block;
    margin: 0 auto;
    box-shadow: inset 0 0 15px rgba(0,0,0,0.8);
}

.game-instruction {
    font-size: 12px;
    color: #777;
    margin-top: 5px;
    font-style: italic;
}

/* ================= COMMON CONTROLS ================= */
.action-button {
    margin-top: 15px;
    background: transparent;
    border: 1px solid #ff007f;
    padding: 10px 35px;
    border-radius: 5px;
    color: #ff007f;
    font-family: "Impact", sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: 0.3s;
    outline: none;
}

.action-button:hover {
    background: #ff007f;
    color: #000;
    box-shadow: 0 0 25px #ff007f;
    transform: scale(1.05);
}

.blue-btn {
    border-color: #00f0ff;
    color: #00f0ff;
}
.blue-btn:hover {
    background: #00f0ff;
    color: #000;
    box-shadow: 0 0 25px #00f0ff;
}
</style>

</head>
<body>

<div class="card-wrapper">
    <div class="card-inner" id="cardInner">
        
        <!-- ================= หน้าการ์ด: หน้าโปรไฟล์ของคุณ ================= -->
        <div class="card-face front-card">
            <div class="card-content">
                <div class="hologram-avatar">
                    <div class="mask-core"></div>
                </div>

                <div>
                    <h1>THANADOL</h1>
                    <div class="system-status">CR7.QUANTUM_SYS // ACTIVE</div>
                </div>

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

                <div class="footer-section">
                    <div style="font-size: 13px; color: #aaa; margin-bottom: 5px;">「よろしくお願いします。」</div>
                    <button class="action-button" onclick="toggleCard()">PLAY GAME ⚽</button>
                </div>
            </div>
        </div>

        <!-- ================= หลังการ์ด: มินิเกมเดาะบอล CR7 ================= -->
        <div class="card-face back-card">
            <div class="card-content">
                <div class="game-header">
                    <div>SCORE: <span id="currentScore" style="color:#ff007f; font-weight:bold;">0</span></div>
                    <div>HIGH SCORE: <span id="highScore" style="color:#00f0ff; font-weight:bold;">0</span></div>
                </div>

                <!-- พื้นที่สำหรับคลิกเดาะบอล -->
                <canvas id="gameCanvas" width="370" height="320"></canvas>
                <div class="game-instruction">คลิก/แตะที่ลูกบอลเพื่อเดาะเลี้ยงไม่ให้ตกพื้น!</div>

                <div class="footer-section">
                    <button class="action-button blue-btn" onclick="toggleCard()">BACK TO PROFILE</button>
                </div>
            </div>
        </div>

    </div>
</div>

<script>
// ฟังก์ชันหมุนสลับหน้าการ์ด
function toggleCard() {
    const card = document.getElementById('cardInner');
    card.classList.toggle('flipped');
    
    // ถ้าหมุนมาฝั่งเกม ให้เริ่มระบบเกมใหม่ทันที
    if(card.classList.contains('flipped')) {
        resetGame();
    }
}

// ================= ระบบเกมเดาะบอล (Pure JS Canvas) =================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball = {
    x: canvas.width / 2,
    y: 100,
    radius: 20,
    vx: 2,
    vy: 0,
    gravity: 0.35,
    bounce: -9 // แรงส่งเมื่อโดนเตะขึ้น
};

let score = 0;
let highScore = 0;
let isGameOver = false;
let gameStarted = false;
let siuTextTimer = 0; // แสดงเอฟเฟกต์คำว่า SIUUU!

// ตรวจจับการคลิกบนหน้าจอ Canvas
canvas.addEventListener('mousedown', function(e) {
    handleInGameClick(e);
});
canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    handleInGameClick(mouseEvent);
}, { passive: false });

function handleInGameClick(e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (isGameOver) {
        resetGame();
        return;
    }

    if (!gameStarted) {
        gameStarted = true;
        return;
    }

    // คำนวณระยะห่างจุดคลิกถึงลูกบอล
    const dist = Math.hypot(clickX - ball.x, clickY - ball.y);

    // ถ้ากดโดนลูกบอล (ยอมให้กดง่ายขึ้นโดยบวกเพิ่มรัศมีอีกนิด)
    if (dist < ball.radius + 25) {
        // ผลักบอลขึ้น
        ball.vy = ball.bounce;
        // ส่งแรงออกซ้ายขวาตามจุดที่กดโดนบอล
        ball.vx = (ball.x - clickX) * 0.4;
        
        // คะแนนเพิ่ม
        score++;
        document.getElementById('currentScore').innerText = score;
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').innerText = highScore;
        }

        // เปิดโหมดคำว่า SIUUU! เด้งสู้หน้าจอ
        siuTextTimer = 30;
    }
}

function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = 80;
    ball.vx = (Math.random() - 0.5) * 4;
    ball.vy = 0;
    score = 0;
    document.getElementById('currentScore').innerText = score;
    isGameOver = false;
    gameStarted = false;
    siuTextTimer = 0;
}

// วงรอบอัปเดตและแสดงผลกราฟิกเกม (60fps)
function update() {
    // ล้างหน้าจอทุกเฟรม
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted && !isGameOver) {
        // แสดงคำว่าแตะเพื่อเริ่มเล่น
        ctx.fillStyle = "#00f0ff";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillText("CLICK TO START GAME", canvas.width / 2, canvas.height / 2);
        
        // วาดบอลอยู่นิ่ง ๆ รอ
        drawBall();
    } else if (isGameOver) {
        // หน้าจอ Game Over
        ctx.fillStyle = "#ff007f";
        ctx.font = "bold 26px 'Impact', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
        
        ctx.fillStyle = "#fff";
        ctx.font = "14px monospace";
        ctx.fillText("CLICK TO RESTART", canvas.width / 2, canvas.height / 2 + 20);
    } else {
        // ย้ายตำแหน่งลูกบอล
        ball.vy += ball.gravity;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // ชนขอบซ้ายขวาให้เด้งกลับ
        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx = -ball.vx * 0.8;
        }
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.vx = -ball.vx * 0.8;
        }

        // ตกพื้น = แพ้ (Game Over)
        if (ball.y + ball.radius > canvas.height) {
            isGameOver = true;
        }

        // วาดบอลฟุตบอลนีออนสีชมพูขาว
        drawBall();

        // เอฟเฟกต์ "SIUUU!" ลอยขึ้นเมื่อเดาะโดน
        if (siuTextTimer > 0) {
            ctx.fillStyle = "#ffd700";
            ctx.font = "bold 28px 'Impact', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("SIUUUUUU!", ball.x, ball.y - 45);
            siuTextTimer--;
        }
    }

    requestAnimationFrame(update);
}

function drawBall() {
    // แสงเรืองแสงใต้ลูกบอล (Neon Glow)
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius + 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 0, 127, 0.25)";
    ctx.fill();

    // ตัวลูกบอลหลัก
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ff007f";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // ลวดลายฟุตบอลสไตล์ไซไฟ
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius - 8, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.stroke();
}

// รันระเบิดความมันส์ของเกม
update();
</script>

</body>
</html>
    `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Ultimate Gaming Profile Server is running on port ${PORT}`);
});
