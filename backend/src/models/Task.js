// TASK 3 TODO: define the Mongoose schema for a Task here.
// Suggested fields: title, project (ref to Project), status (todo/in-progress/done),
// priority, dueDate.
//
//   const mongoose = require('mongoose');
//   const taskSchema = new mongoose.Schema({ ... }, { timestamps: true });
//   module.exports = mongoose.model('Task', taskSchema);

const { pool } = require('../config/db');

const COLUMNS = `id, title, project_id AS "projectId", status, priority, due_date AS "dueDate",
                 created_at AS "createdAt", updated_at AS "updatedAt"`;

async function findAll({ projectId, status } = {}) {
  const conditions = [];
  const values = [];
  if (projectId) {
    values.push(projectId);
    conditions.push(`project_id = $${values.length}`);
  }
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(`SELECT ${COLUMNS} FROM tasks ${where} ORDER BY id`, values);
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(`SELECT ${COLUMNS} FROM tasks WHERE id = $1`, [id]);
  return result.rows[0] || null;
}

async function create({ title, projectId, status, priority, dueDate }) {
  const result = await pool.query(
    `INSERT INTO tasks (title, project_id, status, priority, due_date) VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUMNS}`,
    [title, projectId, status || 'To Do', priority || 'Medium', dueDate || null]
  );
  return result.rows[0];
}

async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const result = await pool.query(
    `UPDATE tasks SET title = $1, status = $2, priority = $3, due_date = $4, updated_at = NOW()
     WHERE id = $5 RETURNING ${COLUMNS}`,
    [data.title ?? existing.title, data.status ?? existing.status, data.priority ?? existing.priority, data.dueDate ?? existing.dueDate, id]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
  return result.rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };