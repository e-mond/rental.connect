/**
 * Custom error class for API-related errors.
 */
export class ApiError extends Error {
  /**
   * Creates an instance of ApiError.
   * @param {string} message - The error message.
   * @param {string} [type="unknown"] - The type of error (e.g., "auth", "client", "server", "network").
   * @param {number} [status=null] - The HTTP status code, if applicable.
   * @param {any} [details=null] - Additional error details.
   */
  constructor(message, type = "unknown", status = null, details = null) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.status = status;
    this.details = details;
  }
}
