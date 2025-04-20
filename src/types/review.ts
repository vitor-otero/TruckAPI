export interface CreateReviewInput {
  truckStopId: number;
  rating: number;
  comment?: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  truckStopId: number;
}
