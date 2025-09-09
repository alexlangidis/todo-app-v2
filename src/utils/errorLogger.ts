/**
 * Error logging and monitoring utilities
 */

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  additionalData?: Record<string, unknown>;
}

export const logError = (error: Error | string, context?: ErrorContext) => {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  const logData = {
    message: errorMessage,
    stack: errorStack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.error("Error logged:", logData);
  }

  // In production, you could send to error tracking service
  if (import.meta.env.PROD) {
    // Example: Send to error tracking service
    // sendToErrorTracker(logData);

    // For now, just log to console
    console.error("Production error:", logData);
  }
};

export const logUserAction = (
  action: string,
  data?: Record<string, unknown>
) => {
  if (import.meta.env.DEV) {
    console.log(`User action: ${action}`, data);
  }

  // In production, you could track analytics
  if (import.meta.env.PROD) {
    // Example: Send to analytics service
    // trackEvent(action, data);
  }
};

export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  context?: ErrorContext
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error(String(error)),
      context
    );
    return null;
  }
};
