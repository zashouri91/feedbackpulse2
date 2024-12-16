import { z } from 'zod';
import { AppError } from '../errorHandler';

export async function validateData<T>(schema: z.Schema<T>, data: unknown): Promise<T> {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(error.errors[0].message, 'VALIDATION_ERROR', { errors: error.errors });
    }
    throw error;
  }
}

export function validateSync<T>(schema: z.Schema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(error.errors[0].message, 'VALIDATION_ERROR', { errors: error.errors });
    }
    throw error;
  }
}
