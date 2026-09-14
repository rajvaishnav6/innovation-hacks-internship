const { pool } = require('../config/db');

async function findAll() {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at AS "createdAt" FROM users ORDER BY id`
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at AS "createdAt" FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

async function findByEmail(email) {
  const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
  return result.rows[0] || null;
}

// Ye function SIRF login ke liye hai - isme password (hashed) bhi shamil hai.
// findAll/findById jaanbujh kar password nahi bhejte, taaki wo kabhi
// galti se frontend tak na pahunche.
async function findByEmailWithPassword(email) {
  const result = await pool.query(
    `SELECT id, name, email, role, password FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

async function create({ name, email, role, password }) {
  const result = await pool.query(
    `INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at AS "createdAt"`,
    [name, email, role || 'Intern', password]
  );
  return result.rows[0];
}

async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4
     RETURNING id, name, email, role, created_at AS "createdAt"`,
    [data.name ?? existing.name, data.email ?? existing.email, data.role ?? existing.role, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result.rowCount > 0;
}

module.exports = { findAll, findById, findByEmail, findByEmailWithPassword, create, update, remove };