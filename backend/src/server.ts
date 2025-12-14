import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

app.use('/api', routes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Rock Stock backend listening on port ${PORT}`);
});

export default app;
