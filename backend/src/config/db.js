// TASK 3 TODO: connect to MongoDB (or MySQL/PostgreSQL if you switch) here,
// using MONGODB_URI from your .env file. This is called once from
// server.js on startup, before the server starts listening.
//
// Example once you're ready (MongoDB + Mongoose):
//
//   const mongoose = require('mongoose');
//   module.exports = async function connectDB() {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB connected');
//   };

const { Pool, types } = require('pg');
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

async function connectDB() {
  try {
    await pool.query('SELECT NOW()');
    console.log('PostgreSQL connected');
  } catch (err) {
    console.error('PostgreSQL connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, connectDB };
