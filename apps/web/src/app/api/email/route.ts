import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@omnipdf/api/src/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, to, data } = body;

    if (!type || !to) {
      return NextResponse.json(
        { error: 'Missing required fields: type, to' },
        { status: 400 }
      );
    }

    const emailService = new EmailService(process.env.RESEND_API_KEY);

    let result;

    switch (type) {
      case 'verification':
        result = await emailService.sendVerificationEmail(to, data);
        break;
      case 'password-reset':
        result = await emailService.sendPasswordResetEmail(to, data);
        break;
      case 'welcome':
        result = await emailService.sendWelcomeEmail(to, data);
        break;
      case 'conversion-complete':
        result = await emailService.sendConversionCompleteEmail(to, data);
        break;
      case 'subscription-upgrade':
        result = await emailService.sendSubscriptionUpgradeEmail(to, data);
        break;
      case 'payment-failed':
        result = await emailService.sendPaymentFailedEmail(to, data);
        break;
      case 'storage-limit-warning':
        result = await emailService.sendStorageLimitWarningEmail(to, data);
        break;
      case 'security-alert':
        result = await emailService.sendSecurityAlertEmail(to, data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
