import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

let dbConnection;

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
  if (req.method === 'OPTIONS') {
    return app(req, res);
  }

  await ensureDatabaseConnection();
  return app(req, res);
}
