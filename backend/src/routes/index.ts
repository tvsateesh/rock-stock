import { Router } from 'express';
import quoteRouter from './quote';
import historicalRouter from './historical';
import searchRouter from './search';

const router = Router();

router.use('/quote', quoteRouter);
router.use('/historical', historicalRouter);
router.use('/search', searchRouter);

export default router;
