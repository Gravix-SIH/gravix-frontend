import { apiService } from './api';
import { User } from '@/models/User';
import { AuthTokens } from '@/models/types';

export interface SendVerificationResponse {
	success: boolean;
	message?: string;
	email?: string;
	error?: string;
}

export interface VerifyEmailResponse {
	success: boolean;
	user?: User;
	access?: string;
	refresh?: string;
	error?: string;
}

export const authApi = {
	async sendVerification(data: {
		email: string;
		name: string;
		password: string;
		role: 'student' | 'counsellor';
	}): Promise<SendVerificationResponse> {
		try {
			const response = await apiService.post<SendVerificationResponse>(
				'/auth/send-verification',
				data,
				false
			);
			return response;
		} catch (error) {
			console.error('Send verification error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to send verification code',
			};
		}
	},

	async verifyEmail(email: string, code: string): Promise<VerifyEmailResponse> {
		try {
			const response = await apiService.post<VerifyEmailResponse>(
				'/auth/verify-email',
				{ email, code },
				false
			);
			return response;
		} catch (error) {
			console.error('Verify email error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to verify email',
			};
		}
	},

	async resendVerification(email: string): Promise<SendVerificationResponse> {
		try {
			const response = await apiService.post<SendVerificationResponse>(
				'/auth/resend-verification',
				{ email },
				false
			);
			return response;
		} catch (error) {
			console.error('Resend verification error:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Failed to resend code',
			};
		}
	},
};