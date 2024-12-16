export interface FeedbackResponse {
  id: string;
  surveyId: string;
  rating: number;
  reason: string;
  comment?: string;
  answers: Record<string, string>;
  contact?: boolean;
  email?: string;
  userId?: string;
  groupId?: string;
  locationId?: string;
  trackingCode: string;
  createdAt: string;
}

export interface FeedbackStats {
  totalResponses: number;
  averageRating: number;
  responseRate: number;
  ratingDistribution: Record<number, number>;
  commonReasons: Array<{
    reason: string;
    count: number;
  }>;
  recentTrend: Array<{
    date: string;
    averageRating: number;
    responses: number;
  }>;
}
