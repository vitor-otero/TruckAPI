import { Request, Response } from 'express';
import { ReviewService } from '../services/review.service';
import { CreateReviewInput } from '../types/review';

const reviewService = new ReviewService();

export class ReviewController {
  async create(req: Request, res: Response) {
    try {
      const input: CreateReviewInput = req.body;
      const userId = (req as any).user.id;
      const review = await reviewService.createReview(input, userId);
      res.status(201).json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const input: Partial<CreateReviewInput> = req.body;
      const review = await reviewService.updateReview(Number(id), userId, input);
      res.status(200).json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      await reviewService.deleteReview(Number(id), userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
