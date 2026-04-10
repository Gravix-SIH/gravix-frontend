import { NextRequest, NextResponse } from 'next/server';
import { verifyCode, getPendingUser, clearVerification } from '@/services/verificationStore';
import { apiService } from '@/services/api';
import { TokenStorage } from '@/utils/storage';

export async function POST(request: NextRequest) {
	try {
		const { email, code } = await request.json();

		if (!email || !code) {
			return NextResponse.json(
				{ success: false, error: 'Missing email or code' },
				{ status: 400 }
			);
		}

		// Verify the code
		const isValid = verifyCode(email, code);

		if (!isValid) {
			return NextResponse.json(
				{ success: false, error: 'Invalid or expired verification code' },
				{ status: 400 }
			);
		}

		// Get pending user data
		const pendingUser = getPendingUser(email);

		if (!pendingUser) {
			return NextResponse.json(
				{ success: false, error: 'No pending registration found' },
				{ status: 400 }
			);
		}

		// Call backend to create the user
		try {
			const response = await apiService.post('/signup', {
				email,
				name: pendingUser.name,
				password: pendingUser.password,
				role: pendingUser.role,
			}, false);

			// Store tokens
			TokenStorage.setTokens({
				access: response.access,
				refresh: response.refresh,
			});

			// Clear verification after successful signup
			clearVerification(email);

			return NextResponse.json({
				success: true,
				user: response.user,
				access: response.access,
				refresh: response.refresh,
			});
		} catch (apiError: any) {
			console.error('Backend signup error:', apiError);

			// If backend fails, still allow retry
			// Re-generate code for user to try again
			return NextResponse.json(
				{ success: false, error: apiError.message || 'Failed to create account' },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error('Verify error:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}