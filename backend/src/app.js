import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'express-async-errors';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import commentRoutes from './routes/comments.js';
import engagementRoutes from './routes/engagement.js';
import searchRoutes from './routes/search.js';
import userRoutes from './routes/users.js';
import { errorHandler } from './middleware/error.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/engagement', engagementRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'zorvyn-backend' });
});

app.use(errorHandler);

export default app;
