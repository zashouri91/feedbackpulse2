import type { Survey } from '../types/survey';

export function validateSurvey(survey: Partial<Survey>): string[] {
  const errors: string[] = [];

  if (!survey.title?.trim()) {
    errors.push('Survey title is required');
  }

  if (!survey.questions?.length) {
    errors.push('Survey must have at least one question');
  }

  survey.questions?.forEach((question, index) => {
    if (!question.text?.trim()) {
      errors.push(`Question ${index + 1} text is required`);
    }
    if (
      question.type === 'multipleChoice' &&
      (!question.options?.length || question.options.length < 2)
    ) {
      errors.push(`Question ${index + 1} must have at least 2 options`);
    }
  });

  return errors;
}

export function generateTrackingCode(data: {
  surveyId: string;
  userId?: string;
  groupId?: string;
  locationId?: string;
}): string {
  return btoa(
    JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    })
  );
}

export function parseTrackingCode(code: string): {
  surveyId: string;
  userId?: string;
  groupId?: string;
  locationId?: string;
  timestamp: string;
} | null {
  try {
    return JSON.parse(atob(code));
  } catch {
    return null;
  }
}

export function calculateResponseRate(survey: Survey): number {
  if (!survey.responseCount || !survey.assignedTo) return 0;

  let totalAssigned = 0;
  if (survey.assignedTo.users?.length) {
    totalAssigned += survey.assignedTo.users.length;
  }
  // Add estimated users from groups and locations if needed

  return totalAssigned ? (survey.responseCount / totalAssigned) * 100 : 0;
}
