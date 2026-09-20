const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');

const aiRoutes = require('./routes/aiRoutes');

const app = express();

app.use(express.json({ type: '*/*' }));
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
  'https://innovation-hacks-internship.vercel.app',
  'https://innovation-hacks-internship-1ditab4br-raj-vaishnav.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

app.get('/', (req, res) => {
  res.json({
    message: 'Innovation Hacks backend is running.',
    endpoints: ['/api/health', '/api/users', '/api/projects', '/api/tasks'],
  });
});

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Innovation Hacks backend is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use(errorHandler);

module.exports = app;
