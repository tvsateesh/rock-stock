import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import { logger } from './middleware/logger';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);
app.use(rateLimiter);

// Serve API routes
app.use('/api', routes);

// Serve static files from frontend build (if available)
const frontendPath = path.join(__dirname, '../public');
app.use(express.static(frontendPath));

// SPA fallback: redirect all non-API routes to index.html for Angular routing
app.get('*', (req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If index.html doesn't exist, return 404
      res.status(404).json({ error: 'Not found' });
    }
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Rock Stock backend listening on port ${PORT}`);
});

export default app;
