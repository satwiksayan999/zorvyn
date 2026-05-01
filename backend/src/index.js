import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });
console.log('Loaded .env:', result.error ? result.error.message : 'success');

const { default: app } = await import('./app.js');
const { connectDB } = await import('./config/db.js');

const PORT = process.env.PORT || 4000;

try {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Zorvyn backend listening on port ${PORT}`);
  });
} catch (error) {
  console.error('MongoDB connection failed:', error.message);
  console.error('Check MONGODB_URI, Atlas database user/password, and Atlas Network Access IP whitelist.');
  process.exit(1);
}
