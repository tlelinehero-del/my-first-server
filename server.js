const http = require('http');
const url = require('url');
const { Pool } = require('pg');

// เชื่อมต่อฐานข้อมูลผ่าน Environment Variable ของ Railway
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const studentId = parsedUrl.query.id; // เรียกผ่าน /?id=69319011719 เพื่อดึงข้อมูลตาม ID ที่ต้องการ

    // ค่าเริ่มต้น (กรณีดึงข้อมูลจากฐานข้อมูลไม่ได้)
    let studentName = 'ธนดล แสงทอง';
    let studentIdValue = '69319011719';

    try {
        const client = await pool.connect();
        let result;
        if (studentId) {
            result = await client.query('SELECT * FROM students WHERE student_id = $1', [studentId]);
        } else {
            result = await client.query('SELECT * FROM students LIMIT 1');
        }
        client.release();

        if (result.rows.length > 0) {
            studentName = result.rows[0].student_name;
            studentIdValue = result.rows[0].student_id;
        }
    } catch (err) {
        console.error('Database error:', err.message);
        // ถ้าเชื่อมต่อฐานข้อมูลไม่ได้ จะใช้ค่าเริ่มต้นด้านบนแทน
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

    res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CR7 3D Parallax Quantum Card</title>

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
    perspective: 1500px;
}

.bg-grid {
    position: absolute;
    width: 140%;
    height: 140%;
    top: -20%;
    left: -20%;
    background-image:
        linear-gradient(rgba(0, 240, 255, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 240, 255, 0.04) 1px, transparent 1px);
    background-size: 50px 50px;
    transform: perspective(500px) rotateX(60deg) translateY(0);
    z-index: 1;
    transition: transform 0.2s ease-out;
}

.card-wrapper {
    position: relative;
    z-index: 10;
    transform-style: preserve-3d;
    transition: transform 0.1s ease-out;
}

.card-inner {
    width: 440px;
    height: 620px;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-inner.flipped {
    transform: rotateY(180deg);
}

.card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 20px;
    overflow: hidden;
    background: #050510;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
    transform-style: preserve-3d;
}

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

@keyframes laserRotate {
    100% { transform: rotate(360deg); }
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
    transform: translateZ(50px);
}

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
    transform: translateZ(30px);
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
    transform: translateZ(25px);
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
    transform: translateZ(20px);
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
    transform: translateZ(35px) scale(1.02);
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

#gameCanvas {
    background: #03030b;
    border: 2px solid rgba(255, 0, 127, 0.4);
    border-radius: 10px;
    cursor: crosshair;
    display: block;
    margin: 0 auto;
    box-shadow: inset 0 0 15px rgba(0,0,0,0.8);
    transform: translateZ(10px);
}

.game-instruction {
    font-size: 12px;
    color: #777;
    margin-top: 5px;
    font-style: italic;
}

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
    transform: translateZ(15px);
}

.action-button:hover {
    background: #ff007f;
    color: #000;
    box-shadow: 0 0 25px #ff007f;
    transform: translateZ(30px) scale(1.05);
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

<div class="bg-grid" id="bgGrid"></div>

<div class="card-wrapper" id="cardWrapper">
    <div class="card-inner" id="cardInner">

        <!-- ================= FRONT: PROFILE ================= -->
        <div class="card-face front-card">
            <div class="card-content">
                <div class="hologram-avatar">
                    <div class="mask-core"></div>
                </div>

                <div>
                    <h1>${studentName.split(' ')[0].toUpperCase()}</h1>
                    <div class="system-status">CR7.QUANTUM_SYS // ACTIVE</div>
                </div>

                <div class="info-group">
                    <div class="data-slot">
                        <span>USER_NAME</span>
                        <b>${studentName}</b>
                    </div>
                    <div class="data-slot">
                        <span>STUDENT_ID</span>
                        <b>${studentIdValue}</b>
                    </div>
                </div>

                <div class="footer-section">
                    <div style="font-size: 13px; color: #aaa; margin-bottom: 5px;">「よろしくお願いします。」</div>
                    <button class="action-button" onclick="toggleCard()">PLAY GAME ⚽</button>
                </div>
            </div>
        </div>

        <!-- ================= BACK: MINI GAME ================= -->
        <div class="card-face back-card">
            <div class="card-content">
                <div class="game-header">
                    <div>SCORE: <span id="currentScore" style="color:#ff007f; font-weight:bold;">0</span></div>
                    <div>HIGH SCORE: <span id="highScore" style="color:#00f0ff; font-weight:bold;">0</span></div>
                </div>

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
const body = document.body;
const cardWrapper = document.getElementById('cardWrapper');
const bgGrid = document.getElementById('bgGrid');

body.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;

    const rotateY = deltaX * 25;
    const rotateX = -deltaY * 25;

    cardWrapper.style.transform = \`rotateX(\${rotateX}deg) rotateY(\${rotateY}deg)\`;

    const bgX = -deltaX * 30;
    const bgY = -deltaY * 30;
    bgGrid.style.transform = \`perspective(500px) rotateX(60deg) translate(\${bgX}px, \${bgY}px)\`;
});

body.addEventListener('mouseleave', () => {
    cardWrapper.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    cardWrapper.style.transform = 'rotateX(0deg) rotateY(0deg)';

    bgGrid.style.transition = 'transform 0.5s ease-out';
    bgGrid.style.transform = 'perspective(500px) rotateX(60deg) translate(0px, 0px)';

    setTimeout(() => {
        cardWrapper.style.transition = 'transform 0.1s ease-out';
        bgGrid.style.transition = 'transform 0.2s ease-out';
    }, 500);
});

function toggleCard() {
    const card = document.getElementById('cardInner');
    card.classList.toggle('flipped');

    if(card.classList.contains('flipped')) {
        resetGame();
    }
}

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball = {
    x: canvas.width / 2,
    y: 100,
    radius: 20,
    vx: 2,
    vy: 0,
    gravity: 0.35,
    bounce: -9
};

let score = 0;
let highScore = 0;
let isGameOver = false;
let gameStarted = false;
let siuTextTimer = 0;

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

    const dist = Math.hypot(clickX - ball.x, clickY - ball.y);

    if (dist < ball.radius + 25) {
        ball.vy = ball.bounce;
        ball.vx = (ball.x - clickX) * 0.4;

        score++;
        document.getElementById('currentScore').innerText = score;
        if (score > highScore) {
            highScore = score;
            document.getElementById('highScore').innerText = highScore;
        }

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

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted && !isGameOver) {
        ctx.fillStyle = "#00f0ff";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "center";
        ctx.fillText("CLICK TO START GAME", canvas.width / 2, canvas.height / 2);
        drawBall();
    } else if (isGameOver) {
        ctx.fillStyle = "#ff007f";
        ctx.font = "bold 26px 'Impact', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = "#fff";
        ctx.font = "14px monospace";
        ctx.fillText("CLICK TO RESTART", canvas.width / 2, canvas.height / 2 + 20);
    } else {
        ball.vy += ball.gravity;
        ball.x += ball.vx;
        ball.y += ball.vy;

        if (ball.x - ball.radius < 0) {
            ball.x = ball.radius;
            ball.vx = -ball.vx * 0.8;
        }
        if (ball.x + ball.radius > canvas.width) {
            ball.x = canvas.width - ball.radius;
            ball.vx = -ball.vx * 0.8;
        }

        if (ball.y + ball.radius > canvas.height) {
            isGameOver = true;
        }

        drawBall();

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
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius + 10, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 0, 127, 0.25)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ff007f";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius - 8, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.stroke();
}

update();
</script>

</body>
</html>
    `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Ultimate 3D Parallax Server (with DB) is running on port ${PORT}`);
});
