import { ApiResponse } from '../types';

export class ApiError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiResponse<T>(
  promise: Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { 
      success: false, 
      error: 'An unexpected error occurred' 
    };
  }
}

export function createApiError(message: string, code?: string): never {
  throw new ApiError(message, code);
}
