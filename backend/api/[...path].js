import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

let dbConnection;

const allowedOrigins = [
  'http://localhost:5173',
  'https://zorvyn-ysva.vercel.app',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
]
  .filter(Boolean)
  .flatMap((origin) => origin.split(','))
  .map((origin) => origin.trim().replace(/\/$/, ''));

function setCorsHeaders(req, res) {
  const requestOrigin = req.headers.origin?.replace(/\/$/, '');
  const allowedOrigin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[0];

  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
}

async function ensureDatabaseConnection() {
  if (!dbConnection) {
    dbConnection = connectDB().catch((error) => {
      dbConnection = null;
      throw error;
    });
  }

  return dbConnection;
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  await ensureDatabaseConnection();
  return app(req, res);
}
