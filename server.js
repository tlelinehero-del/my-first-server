// ชื่อ: ธนดล แสงทอง
// รหัสนักศึกษา: 69319011719

const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// 1. ตั้งค่าให้ Server อ่านข้อมูลที่ส่งมาจากฟอร์ม (HTML Form) ได้
app.use(express.urlencoded({ extended: true }));

// 2. ตั้งค่าเชื่อมต่อฐานข้อมูล PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ✅ สร้างตารางอัตโนมัติถ้าไม่มีอยู่
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        student_id VARCHAR(20) NOT NULL,
        student_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    client.release();
    console.log('✅ ฐานข้อมูลพร้อมใช้งาน');
  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาดในการสร้างตาราง:', err.message);
  }
}

// ---------------------------------------------------------
// เส้นทางที่ 1: (GET /) เมื่อเปิดหน้าเว็บหลัก ให้แสดงฟอร์มและตารางข้อมูล
// ---------------------------------------------------------
app.get('/', async (req, res) => {
  try {
    const client = await pool.connect();
    // ดึงข้อมูลทั้งหมด เรียงตาม ID
    const result = await client.query('SELECT * FROM students ORDER BY id ASC');
    client.release();
    // สร้างหน้าเว็บ HTML สไตล์การ์ตูนญี่ปุ่นน่ารัก (Kawaii)
    let html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>🌸 ระบบจัดการนักศึกษา 🌸</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Mali:wght@400;600;700&family=Kosugi+Maru&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Mali', 'Kosugi Maru', sans-serif;
    padding: 30px 15px;
    margin: 0;
    min-height: 100vh;
    background: linear-gradient(135deg, #ffd6e8 0%, #d6e8ff 50%, #fff0d6 100%);
    background-attachment: fixed;
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
    background: #fffdfb;
    padding: 30px;
    border-radius: 28px;
    border: 4px solid #ffb6d5;
    box-shadow: 0 10px 0 #ffdcec, 0 15px 25px rgba(255,150,190,0.25);
    position: relative;
  }
  .header-badge {
    text-align: center;
    margin-bottom: 10px;
  }
  .header-badge span {
    display: inline-block;
    background: #fff0f6;
    border: 2px dashed #ff9ec7;
    color: #d6336c;
    padding: 6px 18px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 600;
  }
  h1.title {
    text-align: center;
    color: #ff6fa5;
    font-size: 28px;
    margin: 5px 0 25px;
    text-shadow: 2px 2px 0 #ffe0ee;
  }
  h2 {
    color: #6fa8ff;
    font-size: 19px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 3px dotted #cfe2ff;
    padding-bottom: 8px;
  }
  form.add-form {
    background: #f5faff;
    border: 2px solid #cfe2ff;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 30px;
  }
  label {
    display: block;
    color: #5c8dff;
    font-weight: 700;
    margin: 10px 0 4px;
    font-size: 14px;
  }
  input[type="text"] {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid #d8e6ff;
    border-radius: 14px;
    font-family: inherit;
    font-size: 14px;
    background: #ffffff;
    transition: 0.2s;
  }
  input[type="text"]:focus {
    outline: none;
    border-color: #ff9ec7;
    box-shadow: 0 0 0 3px #ffe0ee;
  }
  .btn-add {
    margin-top: 16px;
    background: linear-gradient(135deg, #7fd8a0, #5cc98e);
    color: white;
    padding: 12px 22px;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 700;
    font-size: 14px;
    box-shadow: 0 4px 0 #3fa86e;
  }
  .btn-add:active { box-shadow: 0 1px 0 #3fa86e; transform: translateY(3px); }
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
    margin-top: 15px;
  }
  th {
    background: #ffb6d5;
    color: white;
    padding: 12px;
    text-align: left;
    font-size: 13px;
  }
  th:first-child { border-radius: 12px 0 0 12px; }
  th:last-child { border-radius: 0 12px 12px 0; }
  td {
    background: #fff8fb;
    padding: 12px;
    border-top: 2px solid #ffe0ee;
    border-bottom: 2px solid #ffe0ee;
    font-size: 14px;
    color: #555;
  }
  td:first-child { border-left: 2px solid #ffe0ee; border-radius: 12px 0 0 12px; }
  td:last-child { border-right: 2px solid #ffe0ee; border-radius: 0 12px 12px 0; }
  .btn-delete {
    background: linear-gradient(135deg, #ff9eb0, #ff6f8e);
    color: white;
    padding: 6px 14px;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 700;
    font-size: 12px;
    box-shadow: 0 3px 0 #d6486a;
  }
  .btn-delete:active { box-shadow: 0 1px 0 #d6486a; transform: translateY(2px); }
  .footer-credit {
    text-align: center;
    margin-top: 25px;
    font-size: 12px;
    color: #b3a3c9;
  }
  .empty-state {
    text-align: center;
    padding: 25px;
    color: #b3c7ff;
    font-size: 14px;
  }
</style>
</head>
<body>
<div class="container">
  <div class="header-badge"><span>✨ Student Portal ✨</span></div>
  <h1 class="title">🌸 ระบบจัดการนักศึกษา 🌸</h1>

  <h2>🌷 เพิ่มข้อมูลนักศึกษาใหม่</h2>
  <form class="add-form" action="/add" method="POST">
    <label>🎫 รหัสนักศึกษา</label>
    <input type="text" name="student_id" placeholder="กรอกรหัสนักศึกษา" required>
    <label>🧑‍🎓 ชื่อ-นามสกุล</label>
    <input type="text" name="student_name" placeholder="กรอกชื่อ-นามสกุล" required>
    <button type="submit" class="btn-add">💾 บันทึกข้อมูล</button>
  </form>

  <h2>📋 รายชื่อนักศึกษาในระบบ</h2>
  <table>
    <tr><th>ID ระบบ</th><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th><th>จัดการ</th></tr>
`;
    if (result.rows.length === 0) {
      html += `<tr><td colspan="4" class="empty-state">🐣 ยังไม่มีข้อมูลนักศึกษา ลองเพิ่มดูสิ~</td></tr>`;
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
          <button type="submit" class="btn-delete" onclick="return confirm('ยืนยันการลบข้อมูลนี้? (｡•́︿•̀｡)')">🗑️ ลบ</button>
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
    res.send(`เกิดข้อผิดพลาด: ${err.message}`);
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
    res.send(`เกิดข้อผิดพลาดในการเพิ่มข้อมูล: ${err.message}`);
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
    res.send(`เกิดข้อผิดพลาดในการลบข้อมูล: ${err.message}`);
  }
});

// สั่งให้ Server เริ่มทำงาน
app.listen(port, async () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📍 เปิดที่ http://localhost:${port}`);
  
  // ✅ เริ่มต้นฐานข้อมูลเมื่อ server เปิด
  await initializeDatabase();
});
