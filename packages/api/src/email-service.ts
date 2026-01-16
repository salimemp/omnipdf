import { EmailTemplate } from './templates';

interface SendEmailParams {
  to: string;
  subject: string;
  template: EmailTemplate;
  data: Record<string, any>;
}

type EmailTemplateType = 
  | 'email-verification'
  | 'password-reset'
  | 'welcome'
  | 'conversion-complete'
  | 'subscription-upgrade'
  | 'subscription-cancel'
  | 'payment-failed'
  | 'storage-limit-warning'
  | 'security-alert';

export class EmailService {
  private apiKey: string;
  private baseUrl: string = 'https://api.resend.com';

  constructor(apiKey: string = process.env.RESEND_API_KEY) {
    this.apiKey = apiKey || '';
  }

  private async send(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
    const template = templates[params.template];
    
    if (!template) {
      return { success: false, error: 'Invalid template' };
    }

    const html = template.render(params.data);
    const text = template.renderText(params.data);

    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: params.to,
          subject: params.subject,
          html,
          text,
          from: 'OmniPDF <noreply@omnipdf.com>',
          reply_to: 'support@omnipdf.com',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to send email' };
    }
  }

  async sendVerificationEmail(
    to: string,
    data: { name: string; verificationUrl: string; expiresIn: string }
  ): Promise<{ success: boolean; error?: string }> {
    return this.send({
      to,
      subject: 'Verify Your Email - OmniPDF',
      template: 'email-verification',
      data,
    });
  }

  async sendPasswordResetEmail(
    to: string,
    data: { name: string; resetUrl: string; expiresIn: string }
  ): Promise<{ success: boolean; error?: string }> {
    return this.send({
      to,
      subject: 'Reset Your Password - OmniPDF',
      template: 'password-reset',
      data,
    });
  }

  async sendWelcomeEmail(
    to: string,
    data: { name: string; loginUrl: string; features: string[] }
  ): Promise<{ success: boolean; error?: string }> {
    return this.send({
      to,
      subject: 'Welcome to OmniPDF!',
      template: 'welcome',
      data,
    });
  }

  async sendConversionCompleteEmail(
    to: string,
    data: { 
      name: string; 
      fileName: string; 
      downloadUrl: string; 
      conversionType: string;
      fileSize: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    return this.send({
      to,
      subject: `Your ${data.conversionType} is ready - OmniPDF`,
      template: 'conversion-complete',
      data,
    });
  }

  async sendSubscriptionUpgradeEmail(
    to: string,
    data: { 
      name: string; 
      planName: string; 
      newFeatures: string[];
      billingUrl: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    return this.send({
      to,
      subject: `You've upgraded to ${data.planName} - OmniPDF`,
      template: 'subscription-upgrade',
      data,
    });
  }

  async sendPaymentFailedEmail(
    to: string,
    data: { 
      name: string; 
      amount: string;
      nextAttemptDate: string;
      updatePaymentUrl: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    return this.send({
      to,
      subject: 'Payment Failed - Action Required - OmniPDF',
      template: 'payment-failed',
      data,
    });
  }

  async sendStorageLimitWarningEmail(
    to: string,
    data: { 
      name: string; 
      currentUsage: string;
      storageLimit: string;
      upgradeUrl: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    return this.send({
      to,
      subject: 'Storage Limit Warning - OmniPDF',
      template: 'storage-limit-warning',
      data,
    });
  }

  async sendSecurityAlertEmail(
    to: string,
    data: { 
      name: string; 
      activity: string;
      location: string;
      time: string;
      device: string;
      secureAccountUrl: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    return this.send({
      to,
      subject: 'Security Alert - Unusual Activity Detected - OmniPDF',
      template: 'security-alert',
      data,
    });
  }
}

export const emailService = new EmailService();
