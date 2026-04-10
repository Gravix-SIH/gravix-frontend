import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationCode, getVerificationEntry } from '@/services/verificationStore';
import { sendAccountVerificationCodeEmail } from '@/services/emailService';

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		if (!email) {
			return NextResponse.json(
				{ success: false, error: 'Email is required' },
				{ status: 400 }
			);
		}

		// Get existing entry
		const entry = getVerificationEntry(email);

		if (!entry || !entry.name) {
			return NextResponse.json(
				{ success: false, error: 'No pending registration found. Please register again.' },
				{ status: 400 }
			);
		}

		// Generate new code
		const code = generateVerificationCode(email);

		// Restore user data (generateVerificationCode clears the entry)
		const { setPendingUser } = await import('@/services/verificationStore');
		setPendingUser(email, entry.name, entry.password, entry.role);

		// Send email
		const emailSent = await sendAccountVerificationCodeEmail({
			userName: entry.name,
			userEmail: email,
			verificationCode: code,
			expiresInMinutes: 10,
		});

		if (!emailSent) {
			return NextResponse.json(
				{ success: false, error: 'Failed to send verification email' },
				{ status: 500 }
			);
		}

		return NextResponse.json({
			success: true,
			message: 'Verification code resent',
			email,
		});
	} catch (error) {
		console.error('Resend verification error:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}