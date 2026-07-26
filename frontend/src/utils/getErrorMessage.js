/**
 * Every backend error response has { success: false, message, errors? }.
 * This helper pulls the best human-readable message out of an axios error
 * so components don't each re-implement this fallback chain.
 */
export function getErrorMessage(error) {
  return (
    error?.response?.data?.errors?.[0]?.message ||
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong. Please try again.'
  );
}
