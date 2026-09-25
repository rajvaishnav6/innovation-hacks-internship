const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
}

// ---- Auth ----
export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function register(name, email, password) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
}

export function getMe() {
  return request('/auth/me');
}

// ---- Projects ----
export function getProjects({ status } = {}) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  return request(`/projects${query}`);
}

export function createProject(data) {
  return request('/projects', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProject(id, data) {
  return request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteProject(id) {
  return request(`/projects/${id}`, { method: 'DELETE' });
}

// ---- Tasks ----
export function getTasks({ projectId, status } = {}) {
  const params = new URLSearchParams();
  if (projectId) params.set('projectId', projectId);
  if (status) params.set('status', status);
  const query = params.toString() ? `?${params.toString()}` : '';
  return request(`/tasks${query}`);
}

export function createTask(data) {
  return request('/tasks', { method: 'POST', body: JSON.stringify(data) });
}

export function updateTask(id, data) {
  return request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function updateTaskStatus(id, status) {
  return request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, { method: 'DELETE' });
}

export function generateTasks(projectId) {
  return request('/ai/generate-tasks', { method: 'POST', body: JSON.stringify({ projectId }) });
}

export function updateMe(data) {
  return request('/auth/me', { method: 'PUT', body: JSON.stringify(data) });
}