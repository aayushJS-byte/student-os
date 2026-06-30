import { isAxiosError } from "axios";

interface ApiErrorBody {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export function getApiErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    return (
      error.response?.data.message ?? "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
}
