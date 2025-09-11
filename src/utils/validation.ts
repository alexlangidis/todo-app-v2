/**
 * Input validation utilities for security and data integrity
 */

export const validateTaskText = (
  text: string
): { isValid: boolean; error?: string } => {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: "Task text cannot be empty" };
  }

  if (text.length > 200) {
    return { isValid: false, error: "Task text cannot exceed 200 characters" };
  }

  // Check for potential XSS attempts
  if (
    /<script/i.test(text) ||
    /javascript:/i.test(text) ||
    /on\w+=/i.test(text)
  ) {
    return { isValid: false, error: "Invalid characters in task text" };
  }

  return { isValid: true };
};

export const validateEmail = (
  email: string
): { isValid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  return { isValid: true };
};

export const validatePassword = (
  password: string
): { isValid: boolean; error?: string } => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long",
    };
  }

  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "&#x27;")
    .trim();
};
