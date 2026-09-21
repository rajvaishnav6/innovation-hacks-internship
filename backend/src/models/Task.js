const { pool } = require('../config/db');

const SELECT_COLUMNS = `tasks.id, tasks.title, tasks.project_id AS "projectId", tasks.status, tasks.priority,
                         tasks.due_date AS "dueDate", tasks.created_at AS "createdAt", tasks.updated_at AS "updatedAt"`;

const RETURNING_COLUMNS = `id, title, project_id AS "projectId", status, priority, due_date AS "dueDate",
                            created_at AS "createdAt", updated_at AS "updatedAt"`;

async function findAll({ projectId, status, ownerId } = {}) {
  const conditions = [];
  const values = [];
  let joinClause = '';

  if (ownerId) {
    joinClause = 'JOIN projects ON tasks.project_id = projects.id';
    values.push(ownerId);
    conditions.push(`projects.owner_id = $${values.length}`);
  }
  if (projectId) {
    values.push(projectId);
    conditions.push(`tasks.project_id = $${values.length}`);
  }
  if (status) {
    values.push(status);
    conditions.push(`tasks.status = $${values.length}`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const result = await pool.query(
    `SELECT ${SELECT_COLUMNS} FROM tasks ${joinClause} ${where} ORDER BY tasks.id`,
    values
  );
  return result.rows;
}

async function findById(id) {
  const result = await pool.query(`SELECT ${SELECT_COLUMNS} FROM tasks WHERE tasks.id = $1`, [id]);
  return result.rows[0] || null;
}

async function create({ title, projectId, status, priority, dueDate }) {
  const result = await pool.query(
    `INSERT INTO tasks (title, project_id, status, priority, due_date) VALUES ($1, $2, $3, $4, $5)
     RETURNING ${RETURNING_COLUMNS}`,
    [title, projectId, status || 'To Do', priority || 'Medium', dueDate || null]
  );
  return result.rows[0];
}

async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const result = await pool.query(
    `UPDATE tasks SET title = $1, status = $2, priority = $3, due_date = $4, updated_at = NOW()
     WHERE id = $5 RETURNING ${RETURNING_COLUMNS}`,
    [
      data.title ?? existing.title,
      data.status ?? existing.status,
      data.priority ?? existing.priority,
      data.dueDate ?? existing.dueDate,
      id,
    ]
  );
  return result.rows[0];
}

async function remove(id) {
  const result = await pool.query(`DELETE FROM tasks WHERE id = $1`, [id]);
  return result.rowCount > 0;
}

module.exports = { findAll, findById, create, update, remove };