const { pool } = require('../config/db');

const COLUMNS = `id, name, description, status, due_date AS "dueDate", owner_id AS "ownerId",
                 created_at AS "createdAt", updated_at AS "updatedAt"`;

async function findAll(status, ownerId) {
  const conditions = [];
  const values = [];
  if (ownerId) {
    values.push(ownerId);
    conditions.push(`owner_id = $${values.length}`);
  }
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(`SELECT ${COLUMNS} FROM projects ${where} ORDER BY id`, values);
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(`SELECT ${COLUMNS} FROM projects WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function create({ name, description, status, dueDate, ownerId }) {
  const result = await pool.query(
    `INSERT INTO projects (name, description, status, due_date, owner_id) VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUMNS}`,
    [name, description || '', status || 'Planning', dueDate || null, ownerId || null]
  );
  return result.rows[0];
}

async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const result = await pool.query(
    `UPDATE projects SET name = $1, description = $2, status = $3, due_date = $4, updated_at = NOW()
     WHERE id = $5 RETURNING ${COLUMNS}`,
    [
      data.name ?? existing.name,
      data.description ?? existing.description,
      data.status ?? existing.status,
      data.dueDate ?? existing.dueDate,
      id,
    ]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(`DELETE FROM projects WHERE id = $1`, [id]);
  return result.rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };