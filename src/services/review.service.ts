import { PrismaClient } from '@prisma/client';
import { CreateReviewInput } from '../types/review';

const prisma = new PrismaClient();

export class ReviewService {
  async createReview(input: CreateReviewInput, userId: number) {
    // Check if user already reviewed this truck stop
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_truckStopId: {
          userId,
          truckStopId: input.truckStopId
        }
      }
    });

    if (existingReview) {
      throw new Error('You have already reviewed this truck stop');
    }

    if (input.rating < 1 || input.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return prisma.review.create({
      data: {
        ...input,
        userId
      }
    });
  }

  async updateReview(id: number, userId: number, input: Partial<CreateReviewInput>) {
    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('Unauthorized to update this review');
    }

    if (input.rating && (input.rating < 1 || input.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    return prisma.review.update({
      where: { id },
      data: input
    });
  }

  async deleteReview(id: number, userId: number) {
    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      throw new Error('Review not found');
    }

    if (review.userId !== userId) {
      throw new Error('Unauthorized to delete this review');
    }

    return prisma.review.delete({
      where: { id }
    });
  }
}
