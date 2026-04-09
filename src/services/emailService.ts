import nodemailer, { Transporter } from 'nodemailer';

// Types
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export interface BookingConfirmationEmailData {
  studentName: string;
  studentEmail: string;
  counselorName: string;
  sessionType: 'video' | 'in-person' | 'phone';
  dateTime: string;
  meetingLink?: string;
  location?: string;
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

// Create transporter
const createTransporter = (): Transporter => {
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '587');
  const secure = process.env.EMAIL_SECURE === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send email
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    const toAddresses = Array.isArray(options.to) ? options.to.join(', ') : options.to;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Gravix" <noreply@gravix.com>',
      to: toAddresses,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    });

    console.log(`Email sent successfully to ${toAddresses}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

// Email Templates
const baseEmailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gravix</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Gravix</h1>
    <p>Your Mental Wellness Companion</p>
  </div>
  <div class="content">
    ${content}
  </div>
  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} Gravix. All rights reserved.</p>
    <p>This email was sent because you have an account on Gravix.</p>
  </div>
</body>
</html>
`;

// Booking Confirmation Email
export const sendBookingConfirmationEmail = async (
  data: BookingConfirmationEmailData
): Promise<boolean> => {
  const sessionInfo = {
    video: { icon: '🎥', text: `Meeting Link: <a href="${data.meetingLink}">${data.meetingLink}</a>` },
    'in-person': { icon: '📍', text: `Location: ${data.location}` },
    phone: { icon: '📞', text: 'The counselor will call you at the scheduled time' },
  };

  const session = sessionInfo[data.sessionType];

  const content = `
    <h2>Hello ${data.studentName},</h2>
    <p>Your session has been confirmed! Here are the details:</p>
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>📅 Date & Time:</strong> ${data.dateTime}</p>
      <p><strong>👤 Counselor:</strong> ${data.counselorName}</p>
      <p><strong>${session.icon} Session Type:</strong> ${data.sessionType}${data.sessionType === 'video' && data.meetingLink ? `<br>${session.text}` : data.sessionType === 'in-person' ? `<br>${session.text}` : `<br>${session.text}`}</p>
    </div>
    <p>Please log in to your Gravix dashboard to view or manage your bookings.</p>
    <p style="margin-top: 20px;">Best regards,<br>The Gravix Team</p>
  `;

  return sendEmail({
    to: data.studentEmail,
    subject: 'Session Booking Confirmed - Gravix',
    html: baseEmailTemplate(content),
  });
};

// Assessment Reminder Email
export const sendAssessmentReminderEmail = async (
  data: AssessmentReminderEmailData
): Promise<boolean> => {
  const assessmentDescriptions = {
    'PHQ-9': 'Depression screening questionnaire',
    'GAD-7': 'Anxiety screening questionnaire',
    'PSQI': 'Sleep quality assessment',
  };

  const content = `
    <h2>Hello ${data.userName},</h2>
    <p>This is a friendly reminder to complete your ${data.assessmentType} assessment.</p>
    <p><strong>Assessment:</strong> ${data.assessmentType} - ${assessmentDescriptions[data.assessmentType]}</p>
    ${data.dueDate ? `<p><strong>Due Date:</strong> ${data.dueDate}</p>` : ''}
    <p>Regular assessments help you track your mental wellness over time.</p>
    <p style="text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student/assessments" class="button">Complete Assessment</a>
    </p>
    <p style="margin-top: 20px;">Best regards,<br>The Gravix Team</p>
  `;

  return sendEmail({
    to: data.userEmail,
    subject: `Reminder: Complete Your ${data.assessmentType} Assessment - Gravix`,
    html: baseEmailTemplate(content),
  });
};

// Account Verification Email
export const sendAccountVerificationEmail = async (
  data: AccountVerificationEmailData
): Promise<boolean> => {
  const content = `
    <h2>Hello ${data.userName},</h2>
    <p>Thank you for creating an account on Gravix. Please verify your email address by clicking the button below:</p>
    <p style="text-align: center;">
      <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #667eea;">${data.verificationUrl}</p>
    <p>This verification link will expire in 24 hours.</p>
    <p style="margin-top: 20px;">Best regards,<br>The Gravix Team</p>
  `;

  return sendEmail({
    to: data.userEmail,
    subject: 'Verify Your Email Address - Gravix',
    html: baseEmailTemplate(content),
  });
};

// Password Reset Email
export const sendPasswordResetEmail = async (
  data: PasswordResetEmailData
): Promise<boolean> => {
  const content = `
    <h2>Hello ${data.userName},</h2>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <p style="text-align: center;">
      <a href="${data.resetUrl}" class="button">Reset Password</a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #667eea;">${data.resetUrl}</p>
    <p>This reset link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
    <p style="margin-top: 20px;">Best regards,<br>The Gravix Team</p>
  `;

  return sendEmail({
    to: data.userEmail,
    subject: 'Reset Your Password - Gravix',
    html: baseEmailTemplate(content),
  });
};

// Counselor Booking Notification Email
export const sendCounselorBookingNotificationEmail = async (
  data: BookingConfirmationEmailData & { studentNotes?: string }
): Promise<boolean> => {
  const sessionInfo = {
    video: { icon: '🎥', text: `Meeting Link: ${data.meetingLink}` },
    'in-person': { icon: '📍', text: `Location: ${data.location}` },
    phone: { icon: '📞', text: 'Phone session' },
  };

  const session = sessionInfo[data.sessionType];

  const content = `
    <h2>Hello ${data.counselorName},</h2>
    <p>You have a new session booking!</p>
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p><strong>📅 Date & Time:</strong> ${data.dateTime}</p>
      <p><strong>👤 Student:</strong> ${data.studentName}</p>
      <p><strong>${session.icon} Session Type:</strong> ${data.sessionType}</p>
      ${session.text !== 'Phone session' ? `<p><strong>Details:</strong> ${session.text}</p>` : ''}
      ${data.studentNotes ? `<p><strong>Student Notes:</strong> ${data.studentNotes}</p>` : ''}
    </div>
    <p>Please log in to your Gravix counselor dashboard to manage your schedule.</p>
    <p style="margin-top: 20px;">Best regards,<br>The Gravix Team</p>
  `;

  return sendEmail({
    to: data.studentEmail, // This will be changed to counselor email when called
    subject: 'New Session Booking - Gravix',
    html: baseEmailTemplate(content),
  });
};
