CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(100) DEFAULT 'Intern',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  status VARCHAR(50) NOT NULL DEFAULT 'Planning'
    CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold')),
  due_date DATE,
  owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'To Do'
    CHECK (status IN ('To Do', 'In Progress', 'Done')),
  priority VARCHAR(50) NOT NULL DEFAULT 'Medium'
    CHECK (priority IN ('Low', 'Medium', 'High')),
  due_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (name, email, role) VALUES
  ('Aditya Sharma', 'aditya.sharma@example.com', 'Full Stack Development Intern');

INSERT INTO projects (name, description, status, due_date) VALUES
  ('E-Commerce Platform Redesign', 'Revamping the storefront UI and checkout flow.', 'In Progress', '2026-09-10'),
  ('Internal Analytics Dashboard', 'Building internal reporting tools for the growth team.', 'In Progress', '2026-09-18');

INSERT INTO tasks (title, project_id, status, priority, due_date) VALUES
  ('Design new checkout flow wireframes', 1, 'Done', 'High', '2026-08-20'),
  ('Implement cart persistence', 1, 'In Progress', 'High', '2026-08-28');

DELETE FROM users;
ALTER TABLE users ADD COLUMN password VARCHAR(255) NOT NULL;