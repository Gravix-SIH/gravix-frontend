import { NextRequest, NextResponse } from 'next/server';
import {
  sendBookingConfirmationEmail,
  sendAssessmentReminderEmail,
  sendAccountVerificationEmail,
  sendPasswordResetEmail,
  sendCounselorBookingNotificationEmail,
  BookingConfirmationEmailData,
  AssessmentReminderEmailData,
  AccountVerificationEmailData,
  PasswordResetEmailData,
} from '@/services/emailService';

// Email API endpoints
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    let result = false;

    switch (action) {
      case 'booking_confirmation':
        result = await sendBookingConfirmationEmail(data as BookingConfirmationEmailData);
        break;

      case 'assessment_reminder':
        result = await sendAssessmentReminderEmail(data as AssessmentReminderEmailData);
        break;

      case 'account_verification':
        result = await sendAccountVerificationEmail(data as AccountVerificationEmailData);
        break;

      case 'password_reset':
        result = await sendPasswordResetEmail(data as PasswordResetEmailData);
        break;

      case 'counselor_booking_notification':
        result = await sendCounselorBookingNotificationEmail(data);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    if (result) {
      return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'email-api',
    timestamp: new Date().toISOString(),
  });
}
