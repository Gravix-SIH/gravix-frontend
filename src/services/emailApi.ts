import { apiService } from './api';

export type EmailAction =
  | 'booking_confirmation'
  | 'assessment_reminder'
  | 'account_verification'
  | 'password_reset'
  | 'counselor_booking_notification';

export interface EmailApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface BookingEmailData {
  studentName: string;
  studentEmail: string;
  counselorName: string;
  sessionType: 'video' | 'in-person' | 'phone';
  dateTime: string;
  meetingLink?: string;
  location?: string;
  studentNotes?: string;
}

export interface AssessmentReminderEmailData {
  userName: string;
  userEmail: string;
  assessmentType: 'PHQ-9' | 'GAD-7' | 'PSQI';
  dueDate?: string;
}

export interface AccountVerificationEmailData {
  userName: string;
  userEmail: string;
  verificationUrl: string;
}

export interface PasswordResetEmailData {
  userName: string;
  userEmail: string;
  resetUrl: string;
}

export type EmailData =
  | BookingEmailData
  | AssessmentReminderEmailData
  | AccountVerificationEmailData
  | PasswordResetEmailData;

// Email API functions
export const emailApi = {
  async sendEmail(action: EmailAction, data: EmailData): Promise<EmailApiResponse> {
    try {
      const response = await apiService.post<EmailApiResponse>('/email', {
        action,
        data,
      });
      return response;
    } catch (error) {
      console.error('Email API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  },

  async sendBookingConfirmation(data: BookingEmailData): Promise<EmailApiResponse> {
    return this.sendEmail('booking_confirmation', data);
  },

  async sendAssessmentReminder(data: AssessmentReminderEmailData): Promise<EmailApiResponse> {
    return this.sendEmail('assessment_reminder', data);
  },

  async sendAccountVerification(data: AccountVerificationEmailData): Promise<EmailApiResponse> {
    return this.sendEmail('account_verification', data);
  },

  async sendPasswordReset(data: PasswordResetEmailData): Promise<EmailApiResponse> {
    return this.sendEmail('password_reset', data);
  },

  async sendCounselorNotification(data: BookingEmailData): Promise<EmailApiResponse> {
    return this.sendEmail('counselor_booking_notification', data);
  },
};
