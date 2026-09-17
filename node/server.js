import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

// ============================================
// 🔧 MySQL Connection (hardcoded credentials)
// ============================================
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud2',
});

(async () => {
  try {
    const conn = await db.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
  }
})();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Node.js + MySQL server!' });
});

app.get(['/api/users', '/users'], async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users ORDER BY user_id DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({
      error: 'Unable to fetch users',
      detail: err.message,
    });
  }
});

app.get(['/api/users/:id', '/users/:id'], async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('GET /users/:id error:', err);
    res.status(500).json({
      error: 'Unable to fetch user',
      detail: err.message,
    });
  }
});

app.post(['/api/users', '/users'], async (req, res) => {
  const { name, email, country, created_at, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const safeCountry = country?.trim() || null;
  const safeCreatedAt = created_at || new Date().toISOString().slice(0, 10);
  const safeStatus = status === 'inactive' ? 'inactive' : 'active';

  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email, country, created_at, status) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim(), safeCountry, safeCreatedAt, safeStatus]
    );

    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [
      result.insertId,
    ]);

    res.status(201).json({
      message: `User ${name} created!`,
      user: rows[0],
    });
  } catch (err) {
    console.error('POST /users error:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({
      error: 'Unable to create user',
      detail: err.message,
    });
  }
});

app.put(['/api/users/:id', '/users/:id'], async (req, res) => {
  const { id } = req.params;
  const { name, email, country, created_at, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const safeCountry = country?.trim() || null;
  const safeCreatedAt = created_at || null;
  const safeStatus = status === 'inactive' ? 'inactive' : 'active';

  try {
    const [result] = await db.query(
      'UPDATE users SET name = ?, email = ?, country = ?, created_at = ?, status = ? WHERE user_id = ?',
      [name.trim(), email.trim(), safeCountry, safeCreatedAt, safeStatus, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);

    res.json({
      message: `User #${id} updated!`,
      user: rows[0],
    });
  } catch (err) {
    console.error('PUT /users/:id error:', err);
    res.status(500).json({
      error: 'Unable to update user',
      detail: err.message,
    });
  }
});

app.delete(['/api/users/:id', '/users/:id'], async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM orders WHERE user_id = ?', [id]);

    const [result] = await db.query('DELETE FROM users WHERE user_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: `User #${id} deleted!` });
  } catch (err) {
    console.error('DELETE /users/:id error:', err);
    res.status(500).json({
      error: 'Unable to delete user',
      detail: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});