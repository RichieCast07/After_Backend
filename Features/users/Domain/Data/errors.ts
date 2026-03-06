/**
 * Custom error class for HTTP-aware errors with status codes
 */
export class HttpError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = statusCode;
        
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if ((Error as any).captureStackTrace) {
            (Error as any).captureStackTrace(this, HttpError);
        }
    }
}

/**
 * Factory functions for common HTTP errors following REST best practices
 */
export class HttpErrors {
    static badRequest(message: string = 'Bad Request'): HttpError {
        return new HttpError(message, 400);
    }

    static unauthorized(message: string = 'Unauthorized'): HttpError {
        return new HttpError(message, 401);
    }

    static forbidden(message: string = 'Forbidden'): HttpError {
        return new HttpError(message, 403);
    }

    static notFound(message: string = 'Resource not found'): HttpError {
        return new HttpError(message, 404);
    }

    static conflict(message: string = 'Conflict'): HttpError {
        return new HttpError(message, 409);
    }

    static internalServerError(message: string = 'Internal Server Error'): HttpError {
        return new HttpError(message, 500);
    }
}
