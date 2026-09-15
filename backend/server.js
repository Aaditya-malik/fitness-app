import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = 3000;

// Base middlewares
app.use(cors());
app.use(express.json());

// Initialize Database (MongoDB / Mongoose with embedded store fallback)
await connectDB();

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FitTrack AI Backend',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);

// Vite Frontend integration
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: rootDir,
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite development middleware mounted');
  } else {
    const distPath = path.join(rootDir, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('📦 Serving production static bundle from /dist');
  }
}

await setupViteOrStatic();

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 FitTrack AI server listening on http://0.0.0.0:${PORT}`);
});
