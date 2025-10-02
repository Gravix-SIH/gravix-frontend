// Centralized error classes
export class AppError extends Error {
	constructor(message: string, public status: number = 500) {
		super(message);
		this.name = "AppError";
	}
}

export class AuthError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, 401);
	}
}

export class ValidationError extends AppError {
	constructor(message = "Invalid data") {
		super(message, 400);
	}
}
