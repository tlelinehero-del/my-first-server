// ชื่อ: ธนดล แสงทอง
// รหัสนักศึกษา: 69319011719

const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

// 1. ตั้งค่าให้ Server อ่านข้อมูลที่ส่งมาจากฟอร์ม (HTML Form) ได้
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
        student_id VARCHAR(20) NOT NULL UNIQUE,
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
    
    // สร้างหน้าเว็บ HTML สไตล์สมัยใหม่เท่ๆ
    let html = `
<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>📚 Student Management System</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
  * { 
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
  }
  
  body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 30px 15px;
    color: #333;
  }
  
  .container {
    max-width: 1000px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  
  .header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 30px;
    text-align: center;
  }
  
  .header h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  }
  
  .header p {
    font-size: 1em;
    opacity: 0.9;
    font-weight: 300;
  }
  
  .content {
    padding: 40px 30px;
  }
  
  .form-section {
    background: #f8f9ff;
    border-radius: 15px;
    padding: 30px;
    margin-bottom: 30px;
    border-left: 5px solid #667eea;
  }
  
  .form-section h2 {
    color: #667eea;
    margin-bottom: 20px;
    font-size: 1.3em;
    font-weight: 600;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    color: #555;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.95em;
  }
  
  input[type="text"] {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-family: inherit;
    font-size: 1em;
    transition: all 0.3s ease;
  }
  
  input[type="text"]:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  .btn-submit {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 30px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
    font-size: 1em;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    margin-top: 10px;
  }
  
  .btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
  }
  
  .btn-submit:active {
    transform: translateY(0);
  }
  
  .table-section h2 {
    color: #667eea;
    margin-bottom: 20px;
    font-size: 1.3em;
    font-weight: 600;
  }
  
  .table-wrapper {
    overflow-x: auto;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  th {
    padding: 18px 15px;
    text-align: left;
    font-weight: 600;
    font-size: 0.95em;
  }
  
  td {
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
    color: #555;
  }
  
  tbody tr {
    transition: all 0.2s ease;
  }
  
  tbody tr:hover {
    background: #f8f9ff;
  }
  
  .btn-delete {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-family: inherit;
    font-weight: 600;
    font-size: 0.9em;
    transition: all 0.3s ease;
  }
  
  .btn-delete:hover {
    transform: scale(1.05);
  }
  
  .btn-delete:active {
    transform: scale(0.98);
  }
  
  .empty-state {
    text-align: center;
    padding: 40px;
    color: #999;
  }
  
  .empty-state-icon {
    font-size: 3em;
    margin-bottom: 15px;
  }
  
  .empty-state-text {
    font-size: 1.1em;
    font-weight: 300;
  }
  
  .footer {
    background: #f8f9ff;
    padding: 20px;
    text-align: center;
    color: #999;
    font-size: 0.9em;
    border-top: 1px solid #e0e0e0;
  }
  
  .success-message {
    background: #4caf50;
    color: white;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 600;
  }
  
  .error-message {
    background: #f44336;
    color: white;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: 600;
  }
  
  .stats {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    flex: 1;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 15px;
    text-align: center;
  }
  
  .stat-number {
    font-size: 2em;
    font-weight: 700;
    margin-bottom: 5px;
  }
  
  .stat-label {
    font-size: 0.9em;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    .header h1 {
      font-size: 1.8em;
    }
    
    .content {
      padding: 20px;
    }
    
    .form-section {
      padding: 20px;
    }
    
    table {
      font-size: 0.9em;
    }
    
    th, td {
      padding: 10px 8px;
    }
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>📚 Student Management</h1>
    <p>ระบบจัดการข้อมูลนักศึกษา</p>
  </div>
  
  <div class="content">
    ${req.query.success ? '<div class="success-message">✅ บันทึกข้อมูลสำเร็จ!</div>' : ''}
    ${req.query.deleted ? '<div class="success-message">✅ ลบข้อมูลสำเร็จ!</div>' : ''}
    
    <div class="stats">
      <div class="stat-card">
        <div class="stat-number">${result.rows.length}</div>
        <div class="stat-label">นักศึกษาทั้งหมด</div>
      </div>
    </div>
    
    <div class="form-section">
      <h2>➕ เพิ่มข้อมูลนักศึกษาใหม่</h2>
      <form action="/add" method="POST">
        <div class="form-group">
          <label for="student_id">🎫 รหัสนักศึกษา</label>
          <input type="text" id="student_id" name="student_id" placeholder="เช่น 69319011719" required>
        </div>
        <div class="form-group">
          <label for="student_name">👤 ชื่อ-นามสกุล</label>
          <input type="text" id="student_name" name="student_name" placeholder="เช่น ธนดล แสงทอง" required>
        </div>
        <button type="submit" class="btn-submit">💾 บันทึกข้อมูล</button>
      </form>
    </div>
    
    <div class="table-section">
      <h2>📋 รายชื่อนักศึกษา</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style="width: 10%;">ID</th>
              <th style="width: 30%;">รหัสนักศึกษา</th>
              <th style="width: 40%;">ชื่อ-นามสกุล</th>
              <th style="width: 20%; text-align: center;">จัดการ</th>
            </tr>
          </thead>
          <tbody>
`;
    
    if (result.rows.length === 0) {
      html += `
            <tr>
              <td colspan="4">
                <div class="empty-state">
                  <div class="empty-state-icon">🐣</div>
                  <div class="empty-state-text">ยังไม่มีข้อมูลนักศึกษา ลองเพิ่มข้อมูลดูสิ!</div>
                </div>
              </td>
            </tr>
`;
    } else {
      result.rows.forEach((row, index) => {
        html += `
            <tr>
              <td>${index + 1}</td>
              <td><strong>${row.student_id || 'ไม่ระบุ'}</strong></td>
              <td>${row.student_name || 'ไม่ระบุ'}</td>
              <td style="text-align: center;">
                <form action="/delete" method="POST" style="display: inline;">
                  <input type="hidden" name="id" value="${row.id}">
                  <button type="submit" class="btn-delete" onclick="return confirm('🗑️ ยืนยันการลบข้อมูลนี้?')">ลบ</button>
                </form>
              </td>
            </tr>
`;
      });
    }
    
    html += `
          </tbody>
        </table>
      </div>
    </div>
  </div>
  
  <div class="footer">
    <p>👨‍💻 จัดทำโดย: <strong>ธนดล แสงทอง</strong> | 🆔 รหัสนักศึกษา: <strong>69319011719</strong></p>
    <p>✨ Student Management System v2.0</p>
  </div>
</div>
</body>
</html>
`;
    res.send(html);
  } catch (err) {
    res.send(`<div style="padding: 20px; color: red;"><h2>❌ เกิดข้อผิดพลาด</h2><p>${err.message}</p></div>`);
  }
});

// ---------------------------------------------------------
// เส้นทางที่ 2: (POST /add) รับข้อมูลจากฟอร์มมาบันทึกลงฐานข้อมูล
// ---------------------------------------------------------
app.post('/add', async (req, res) => {
  const { student_id, student_name } = req.body;
  
  // ✅ ตรวจสอบข้อมูลที่ส่งเข้ามา
  if (!student_id || !student_name) {
    return res.send(`
      <script>
        alert('❌ กรุณากรอกข้อมูลให้ครบ!');
        window.history.back();
      </script>
    `);
  }
  
  // ✅ ตัดช่องว่าง
  const trimmedStudentId = student_id.trim();
  const trimmedStudentName = student_name.trim();
  
  if (!trimmedStudentId || !trimmedStudentName) {
    return res.send(`
      <script>
        alert('❌ กรุณากรอกข้อมูลให้ครบ! (ไม่มีช่องว่าง)');
        window.history.back();
      </script>
    `);
  }
  
  try {
    const client = await pool.connect();
    // ✅ ใช้ Parameterized Query เพื่อป้องกัน SQL Injection
    await client.query(
      'INSERT INTO students (student_id, student_name) VALUES ($1, $2)',
      [trimmedStudentId, trimmedStudentName]
    );
    client.release();
    res.redirect('/?success=true'); // บันทึกเสร็จ ให้เด้งกลับไปหน้าแรก
  } catch (err) {
    if (err.code === '23505') { // Unique constraint violation
      res.send(`
        <script>
          alert('❌ รหัสนักศึกษานี้มีอยู่แล้ว!');
          window.history.back();
        </script>
      `);
    } else {
      res.send(`
        <script>
          alert('❌ เกิดข้อผิดพลาด: ${err.message.replace(/'/g, "\\'")}');
          window.history.back();
        </script>
      `);
    }
  }
});

// ---------------------------------------------------------
// เส้นทางที่ 3: (POST /delete) รับ ID มาเพื่อลบข้อมูล
// ---------------------------------------------------------
app.post('/delete', async (req, res) => {
  const { id } = req.body;
  
  // ✅ ตรวจสอบ ID
  if (!id || isNaN(id)) {
    return res.send(`
      <script>
        alert('❌ ID ไม่ถูกต้อง!');
        window.history.back();
      </script>
    `);
  }
  
  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM students WHERE id = $1', [id]);
    client.release();
    
    if (result.rowCount === 0) {
      return res.send(`
        <script>
          alert('❌ ไม่พบข้อมูลที่ต้องการลบ!');
          window.history.back();
        </script>
      `);
    }
    
    res.redirect('/?deleted=true'); // ลบเสร็จ ให้เด้งกลับไปหน้าแรก
  } catch (err) {
    res.send(`
      <script>
        alert('❌ เกิดข้อผิดพลาดในการลบข้อมูล: ${err.message.replace(/'/g, "\\'")}');
        window.history.back();
      </script>
    `);
  }
});

// สั่งให้ Server เริ่มทำงาน
app.listen(port, async () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📍 เปิดที่ http://localhost:${port}`);
  console.log('================================================');
  
  // ✅ เริ่มต้นฐานข้อมูลเมื่อ server เปิด
  await initializeDatabase();
});
