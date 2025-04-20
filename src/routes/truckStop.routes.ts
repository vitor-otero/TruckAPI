import { Router } from 'express';
import { TruckStopController } from '../controllers/truckStop.controller';
import { ReviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const truckStopController = new TruckStopController();
const reviewController = new ReviewController();

// Public routes
router.get('/search', truckStopController.search.bind(truckStopController));
router.get('/:id', truckStopController.getById.bind(truckStopController));

// Protected routes
router.use(authMiddleware);
router.post('/', truckStopController.create.bind(truckStopController));
router.put('/:id', truckStopController.update.bind(truckStopController));
router.delete('/:id', truckStopController.delete.bind(truckStopController));

// Review routes
router.post('/:id/reviews', reviewController.create.bind(reviewController));
router.put('/reviews/:id', reviewController.update.bind(reviewController));
router.delete('/reviews/:id', reviewController.delete.bind(reviewController));

export default router;
