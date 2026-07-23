// ชื่อ: ธนดล แสงทอง
// รหัสนักศึกษา: 69319011719

const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// ⚠️ เช็คว่ามีการตั้งค่า DATABASE_URL หรือยัง (ถ้าไม่มี ระบบจะต่อฐานข้อมูลไม่ได้)
const DB_URL_MISSING = !process.env.DATABASE_URL;
if (DB_URL_MISSING) {
  console.error('❌ ไม่พบ DATABASE_URL ในตัวแปรแวดล้อม (environment variable)');
  console.error('   ถ้ารันบนเครื่องตัวเอง: ตั้งค่าก่อนรัน เช่น');
  console.error('   DATABASE_URL=postgres://user:pass@host:5432/dbname node server.js');
  console.error('   ถ้า deploy บน Render/Railway/Heroku: ไปที่หน้า Environment Variables ของโปรเจกต์แล้วเพิ่มตัวแปรชื่อ DATABASE_URL');
}

// 1. ตั้งค่าให้ Server อ่านข้อมูลที่ส่งมาจากฟอร์ม (HTML Form) ได้
app.use(express.urlencoded({ extended: true }));

// Middleware: ถ้าไม่มี DATABASE_URL เลย ให้บอกตรง ๆ ทุก route แทนที่จะปล่อยให้ error เป็น undefined
app.use((req, res, next) => {
  if (DB_URL_MISSING) {
    return res.status(500).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; color: #7a1f2b;">
        <h2>⚔️ ไม่พบการตั้งค่าฐานข้อมูล (DATABASE_URL)</h2>
        <p>ตัวแปรแวดล้อม <code>DATABASE_URL</code> ยังไม่ถูกตั้งค่าในระบบที่รัน server นี้อยู่เลย</p>
        <p style="font-size: 13px; color: #999;">
          ถ้ารันบนเครื่องตัวเอง ให้ตั้งค่าตัวแปรนี้ก่อนสั่งรัน<br>
          ถ้า deploy บนแพลตฟอร์ม (Render / Railway / Heroku ฯลฯ) ให้ไปที่หน้า Settings → Environment Variables แล้วเพิ่ม DATABASE_URL ให้เป็น connection string ของฐานข้อมูล PostgreSQL ที่สร้างไว้
        </p>
      </div>
    `);
  }
  next();
});

// 2. ตั้งค่าเชื่อมต่อฐานข้อมูล PostgreSQL
const pool = DB_URL_MISSING ? null : new Pool({
  connectionString: process.env.DATABASE_URL,
});

// เช็คการเชื่อมต่อตอนเริ่ม server และสร้างตาราง students อัตโนมัติถ้ายังไม่มี
// (กันปัญหา "relation students does not exist" เวลา deploy ฐานข้อมูลใหม่)
if (pool) {
pool.connect()
  .then(async (client) => {
    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จ');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS students (
          id SERIAL PRIMARY KEY,
          student_id VARCHAR(20) NOT NULL,
          student_name VARCHAR(255) NOT NULL
        );
      `);
      console.log('✅ ตรวจสอบ/สร้างตาราง students เรียบร้อย');
    } catch (err) {
      console.error('❌ สร้างตาราง students ไม่สำเร็จ:', err.message);
    } finally {
      client.release();
    }
  })
  .catch(err => {
    console.error('❌ เชื่อมต่อฐานข้อมูลไม่สำเร็จ:', err.message);
  });
}

// ---------------------------------------------------------
// เส้นทางที่ 1: (GET /) เมื่อเปิดหน้าเว็บหลัก ให้แสดงฟอร์มและตารางข้อมูล
// ---------------------------------------------------------
app.get('/', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    // แสดง error ที่ชัดเจนแทนที่จะเป็น undefined
    return res.status(500).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; color: #7a1f2b;">
        <h2>⚔️ เชื่อมต่อฐานข้อมูลไม่สำเร็จ</h2>
        <p>รายละเอียด: ${err.message || 'ไม่ทราบสาเหตุ (unknown error)'}</p>
        <p style="font-size: 13px; color: #999;">ตรวจสอบว่าได้ตั้งค่า DATABASE_URL ถูกต้องหรือยัง</p>
      </div>
    `);
  }
  try {
    // ดึงข้อมูลทั้งหมด เรียงตาม ID
    const result = await client.query('SELECT * FROM students ORDER BY id ASC');
    client.release();
    // สร้างหน้าเว็บ HTML สไตล์อัศวินเท่ๆ (Knight)
    let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>⚔️ ระบบจัดการนักศึกษา - Knight Order ⚔️</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Sarabun:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Sarabun', sans-serif;
    padding: 30px 15px;
    margin: 0;
    min-height: 100vh;
    background:
      radial-gradient(circle at 20% 20%, rgba(212,175,55,0.08), transparent 40%),
      radial-gradient(circle at 80% 80%, rgba(212,175,55,0.06), transparent 40%),
      linear-gradient(160deg, #1a1f2b 0%, #10131c 60%, #0a0c12 100%);
    background-attachment: fixed;
  }
  .container {
    max-width: 820px;
    margin: 0 auto;
    background: linear-gradient(180deg, #20263a 0%, #171b28 100%);
    padding: 34px;
    border-radius: 10px;
    border: 2px solid #d4af37;
    box-shadow: 0 0 0 1px #4a3f1e, 0 20px 40px rgba(0,0,0,0.6), inset 0 0 40px rgba(212,175,55,0.03);
    position: relative;
  }
  .container::before, .container::after {
    content: '⚜';
    position: absolute;
    top: 10px;
    color: #d4af37;
    font-size: 18px;
  }
  .container::before { left: 14px; }
  .container::after { right: 14px; }
  h1.title {
    font-family: 'Cinzel', serif;
    text-align: center;
    color: #e8c46a;
    font-size: 30px;
    letter-spacing: 2px;
    margin: 5px 0 6px;
    text-shadow: 0 0 12px rgba(232,196,106,0.4);
  }
  .subtitle {
    text-align: center;
    color: #8b93a8;
    font-size: 13px;
    letter-spacing: 3px;
    margin-bottom: 28px;
    text-transform: uppercase;
  }
  h2 {
    font-family: 'Cinzel', serif;
    color: #d4af37;
    font-size: 18px;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #3a4258;
    padding-bottom: 10px;
    margin-top: 30px;
  }
  form.add-form {
    background: #161a26;
    border: 1px solid #3a4258;
    border-left: 3px solid #d4af37;
    border-radius: 6px;
    padding: 22px;
    margin-bottom: 30px;
  }
  label {
    display: block;
    color: #b9c2d8;
    font-weight: 600;
    margin: 12px 0 5px;
    font-size: 13px;
    letter-spacing: 0.5px;
  }
  input[type="text"] {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid #3a4258;
    border-radius: 5px;
    font-family: inherit;
    font-size: 14px;
    background: #0f1219;
    color: #e6e9f0;
    transition: 0.2s;
  }
  input[type="text"]::placeholder { color: #5a6378; }
  input[type="text"]:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 0 0 3px rgba(212,175,55,0.15);
  }
  .btn-add {
    margin-top: 18px;
    background: linear-gradient(135deg, #d4af37, #a8811f);
    color: #171b28;
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Cinzel', serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    box-shadow: 0 3px 0 #7a5f16;
  }
  .btn-add:active { box-shadow: 0 1px 0 #7a5f16; transform: translateY(2px); }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  th {
    font-family: 'Cinzel', serif;
    background: #0f1219;
    color: #d4af37;
    padding: 12px;
    text-align: left;
    font-size: 12px;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-bottom: 2px solid #d4af37;
  }
  td {
    background: #161a26;
    padding: 12px;
    border-bottom: 1px solid #2a3145;
    font-size: 14px;
    color: #c7cede;
  }
  tr:hover td { background: #1c2135; }
  .btn-delete {
    background: linear-gradient(135deg, #8e2f3a, #5e1e26);
    color: #f0d7d7;
    padding: 6px 14px;
    border: 1px solid #a83e4b;
    border-radius: 5px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
    font-size: 12px;
  }
  .btn-delete:hover { background: linear-gradient(135deg, #a83e4b, #7a2830); }
  .footer-credit {
    text-align: center;
    margin-top: 28px;
    font-size: 12px;
    color: #5a6378;
    letter-spacing: 0.5px;
  }
  .empty-state {
    text-align: center;
    padding: 25px;
    color: #5a6378;
    font-size: 14px;
    font-style: italic;
  }
</style>
</head>
<body>
<div class="container">
  <h1 class="title">⚔️ ระบบจัดการนักศึกษา ⚔️</h1>
  <div class="subtitle">Order of the Registrar</div>

  <h2>🛡️ เพิ่มข้อมูลนักศึกษาใหม่</h2>
  <form class="add-form" action="/add" method="POST">
    <label>รหัสนักศึกษา</label>
    <input type="text" name="student_id" placeholder="กรอกรหัสนักศึกษา" required>
    <label>ชื่อ-นามสกุล</label>
    <input type="text" name="student_name" placeholder="กรอกชื่อ-นามสกุล" required>
    <button type="submit" class="btn-add">⚔️ บันทึกข้อมูล</button>
  </form>

  <h2>📜 รายชื่อนักศึกษาในระบบ</h2>
  <table>
    <tr><th>ID ระบบ</th><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th><th>จัดการ</th></tr>
`;
    if (result.rows.length === 0) {
      html += `<tr><td colspan="4" class="empty-state">🏰 ยังไม่มีนักรบในบันทึก...</td></tr>`;
    }
    // นำข้อมูลจากฐานข้อมูลมาวนลูปแสดงในตาราง
    result.rows.forEach(row => {
      html += `
    <tr>
      <td>${row.id}</td>
      <td>${row.student_id}</td>
      <td>${row.student_name}</td>
      <td style="text-align: center;">
        <form action="/delete" method="POST" style="margin:0;">
          <input type="hidden" name="id" value="${row.id}">
          <button type="submit" class="btn-delete" onclick="return confirm('ยืนยันการลบข้อมูลนี้?')">🗑️ ลบ</button>
        </form>
      </td>
    </tr>
`;
    });
    html += `
  </table>
  <div class="footer-credit">จัดทำโดย ธนดล แสงทอง • รหัสนักศึกษา 69319011719</div>
</div>
</body>
</html>
`;
    res.send(html);
  } catch (err) {
    if (client) client.release();
    res.status(500).send(`
      <div style="font-family: sans-serif; padding: 40px; text-align: center; color: #7a1f2b;">
        <h2>⚔️ เกิดข้อผิดพลาด</h2>
        <p>รายละเอียด: ${err.message || 'ไม่ทราบสาเหตุ (unknown error)'}</p>
        <p style="font-size: 13px; color: #999;">ตรวจสอบว่าตาราง students มีอยู่จริงและมีคอลัมน์ student_id, student_name หรือไม่</p>
      </div>
    `);
  }
});

// ---------------------------------------------------------
// เส้นทางที่ 2: (POST /add) รับข้อมูลจากฟอร์มมาบันทึกลงฐานข้อมูล
// ---------------------------------------------------------
app.post('/add', async (req, res) => {
  // รับค่ามาจากช่อง input ที่ตั้งชื่อ name="student_id" และ name="student_name"
  const { student_id, student_name } = req.body;
  try {
    const client = await pool.connect();
    // คำสั่ง SQL สำหรับ Insert (ใช้ $1, $2 เพื่อป้องกันการโดนแฮกแบบ SQL Injection)
    await client.query('INSERT INTO students (student_id, student_name) VALUES ($1, $2)', [student_id, student_name]);
    client.release();
    res.redirect('/'); // บันทึกเสร็จ ให้เด้งกลับไปหน้าแรก
  } catch (err) {
    res.status(500).send(`เกิดข้อผิดพลาดในการเพิ่มข้อมูล: ${err.message || 'ไม่ทราบสาเหตุ'}`);
  }
});

// ---------------------------------------------------------
// เส้นทางที่ 3: (POST /delete) รับ ID มาเพื่อลบข้อมูล
// ---------------------------------------------------------
app.post('/delete', async (req, res) => {
  const { id } = req.body; // รับ ID ที่ซ่อนไว้ในฟอร์ม
  try {
    const client = await pool.connect();
    // คำสั่ง SQL สำหรับลบข้อมูลตาม ID
    await client.query('DELETE FROM students WHERE id = $1', [id]);
    client.release();
    res.redirect('/'); // ลบเสร็จ ให้เด้งกลับไปหน้าแรก
  } catch (err) {
    res.status(500).send(`เกิดข้อผิดพลาดในการลบข้อมูล: ${err.message || 'ไม่ทราบสาเหตุ'}`);
  }
});

// สั่งให้ Server เริ่มทำงาน
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
