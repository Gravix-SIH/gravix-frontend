import { NextRequest, NextResponse } from 'next/server';
import { generateVerificationCode, setPendingUser, getVerificationEntry } from '@/services/verificationStore';
import { sendAccountVerificationCodeEmail } from '@/services/emailService';

export async function POST(request: NextRequest) {
	try {
		const { email, name, password, role } = await request.json();

		if (!email || !name || !password || !role) {
			return NextResponse.json(
				{ success: false, error: 'Missing required fields' },
				{ status: 400 }
			);
		}

		// Validate role
		if (role !== 'student' && role !== 'counsellor') {
			return NextResponse.json(
				{ success: false, error: 'Invalid role' },
				{ status: 400 }
			);
		}

		// Generate and store verification code
		const code = generateVerificationCode(email);
		setPendingUser(email, name, password, role);

		// Get stored entry to access full data
		const entry = getVerificationEntry(email);
		if (!entry) {
			return NextResponse.json(
				{ success: false, error: 'Failed to generate verification code' },
				{ status: 500 }
			);
		}

		// Send verification email with code
		const emailSent = await sendAccountVerificationCodeEmail({
			userName: name,
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
			message: 'Verification code sent',
			email,
		});
	} catch (error) {
		console.error('Send verification error:', error);
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
}