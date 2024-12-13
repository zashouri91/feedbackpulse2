export interface Signature {
  id: string;
  userId: string;
  surveyId: string;
  trackingCode: string;
  style: {
    name: string;
    title?: string;
    email: string;
    phone?: string;
    logo?: string;
    primaryColor: string;
    layout: 'vertical' | 'horizontal';
  };
  createdAt: string;
  updatedAt: string;
}