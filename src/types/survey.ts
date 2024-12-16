export type QuestionType = 'rating' | 'text' | 'multipleChoice';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: string[];
  conditionalLogic?: {
    dependsOn: string;
    showIf: any;
  };
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  assignedTo: {
    groups?: string[];
    locations?: string[];
    users?: string[];
  };
}

export interface SurveyTemplate
  extends Omit<Survey, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'isActive' | 'assignedTo'> {
  id: string;
  category: string;
}
