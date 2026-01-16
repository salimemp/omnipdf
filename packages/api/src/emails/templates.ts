interface EmailTemplateData {
  [key: string]: any;
}

export interface EmailTemplate {
  subject: (data: EmailTemplateData) => string;
  render: (data: EmailTemplateData) => string;
  renderText: (data: EmailTemplateData) => string;
}

const baseStyles = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OmniPDF</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; color: #18181b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <tr>
        <td style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); padding: 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                  OmniPDF
                </h1>
              </td>
            </tr>
          </table>

          <!-- Content -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 40px 30px;">
`;

const footerStyles = `
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="background-color: #f4f4f5; padding: 20px 30px; text-align: center;">
                <p style="margin: 0 0 10px; color: #71717a; font-size: 14px;">
                  © 2024 OmniPDF. All rights reserved.
                </p>
                <p style="margin: 0;">
                  <a href="https://omnipdf.com" style="color: #0ea5e9; text-decoration: none; font-size: 14px;">Website</a>
                  <span style="color: #d4d4d8; margin: 0 10px;">•</span>
                  <a href="https://omnipdf.com/help" style="color: #0ea5e9; text-decoration: none; font-size: 14px;">Help Center</a>
                  <span style="color: #d4d4d8; margin: 0 10px;">•</span>
                  <a href="https://omnipdf.com/privacy" style="color: #0ea5e9; text-decoration: none; font-size: 14px;">Privacy</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

const buttonStyles = `
  display: inline-block;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: #ffffff;
  text-decoration: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
`;

export const templates: Record<string, EmailTemplate> = {
  "email-verification": {
    subject: () => "Verify Your Email - OmniPDF",
    render: (data) => `
      ${baseStyles}
        <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">
          Welcome to OmniPDF, ${data.name || "there"}!
        </h2>
        <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
          Thanks for signing up! To get started, please verify your email address by clicking the button below.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${data.verificationUrl}" style="${buttonStyles}">
                Verify Email Address
              </a>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
          This verification link will expire in ${data.expiresIn || "24 hours"}.
        </p>
        <p style="margin: 16px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
          If you didn't create an account with OmniPDF, you can safely ignore this email.
        </p>
      ${footerStyles}
    `,
    renderText: (data) => `
      Welcome to OmniPDF!

      Thanks for signing up! To get started, please verify your email address by visiting:
      ${data.verificationUrl}

      This verification link will expire in ${data.expiresIn || "24 hours"}.

      If you didn't create an account with OmniPDF, you can safely ignore this email.

      Best regards,
      The OmniPDF Team
    `,
  },

  "password-reset": {
    subject: () => "Reset Your Password - OmniPDF",
    render: (data) => `
      ${baseStyles}
        <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">
          Reset Your Password
        </h2>
        <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
          Hi ${data.name || "there"}, we received a request to reset your password. Click the button below to create a new password.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${data.resetUrl}" style="${buttonStyles}">
                Reset Password
              </a>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
          This link will expire in ${data.expiresIn || "1 hour"}.
        </p>
        <p style="margin: 16px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
          If you didn't request a password reset, please ignore this email or contact support if you have concerns.
        </p>
      ${footerStyles}
    `,
    renderText: (data) => `
      Reset Your Password

      Hi ${data.name || "there"}, we received a request to reset your password.

      Visit the link below to create a new password:
      ${data.resetUrl}

      This link will expire in ${data.expiresIn || "1 hour"}.

      If you didn't request a password reset, please ignore this email.

      Best regards,
      The OmniPDF Team
    `,
  },

  welcome: {
    subject: () => "Welcome to OmniPDF!",
    render: (data) => `
      ${baseStyles}
        <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">
          Welcome to OmniPDF, ${data.name || "there"}! 🎉
        </h2>
        <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
          Your account has been successfully created. Here's what you can do with OmniPDF:
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding: 0 0 20px;">
              ${(
                data.features || [
                  "Convert PDFs to Word, Excel, PowerPoint, and more",
                  "Merge, split, and compress PDF files",
                  "AI-powered document summarization and translation",
                  "Secure cloud storage integration",
                ]
              )
                .map(
                  (feature: string) => `
                <p style="margin: 0 0 12px; color: #52525b; font-size: 15px; line-height: 1.5;">
                  <span style="color: #0ea5e9; margin-right: 8px;">✓</span>
                  ${feature}
                </p>
              `,
                )
                .join("")}
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${data.loginUrl || "https://omnipdf.com/convert"}" style="${buttonStyles}">
                Start Converting
              </a>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
          Need help? Our support team is here for you.
        </p>
      ${footerStyles}
    `,
    renderText: (data) => `
      Welcome to OmniPDF!

      Your account has been successfully created. Here's what you can do:

      ${(
        data.features || [
          "Convert PDFs to Word, Excel, PowerPoint, and more",
          "Merge, split, and compress PDF files",
          "AI-powered document summarization and translation",
          "Secure cloud storage integration",
        ]
      )
        .map((feature: string) => `✓ ${feature}`)
        .join("\n")}

      Get started at: ${data.loginUrl || "https://omnipdf.com/convert"}

      Need help? Our support team is here for you.

      Best regards,
      The OmniPDF Team
    `,
  },

  "conversion-complete": {
    subject: (data) => `Your ${data.conversionType} is ready - OmniPDF`,
    render: (data) => `
      ${baseStyles}
        <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">
          Your ${data.conversionType} is Ready! ✅
        </h2>
        <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
          Hi ${data.name || "there"}, your document has been successfully converted.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 0;">
              <p style="margin: 0 0 8px; color: #71717a; font-size: 14px;">
                <strong style="color: #18181b;">File:</strong> ${data.fileName}
              </p>
              <p style="margin: 0 0 8px; color: #71717a; font-size: 14px;">
                <strong style="color: #18181b;">Type:</strong> ${data.conversionType}
              </p>
              <p style="margin: 0; color: #71717a; font-size: 14px;">
                <strong style="color: #18181b;">Size:</strong> ${data.fileSize}
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${data.downloadUrl}" style="${buttonStyles}">
                Download File
              </a>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
          This download link will expire in 24 hours.
        </p>
      ${footerStyles}
    `,
    renderText: (data) => `
      Your ${data.conversionType} is Ready!

      Hi ${data.name || "there"}, your document has been successfully converted.

      File: ${data.fileName}
      Type: ${data.conversionType}
      Size: ${data.fileSize}

      Download: ${data.downloadUrl}

      This download link will expire in 24 hours.

      Best regards,
      The OmniPDF Team
    `,
  },

  "subscription-upgrade": {
    subject: (data) => `You've upgraded to ${data.planName} - OmniPDF`,
    render: (data) => `
      ${baseStyles}
        <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">
          Congratulations! 🎉
        </h2>
        <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
          Hi ${data.name || "there"}, you've successfully upgraded to the <strong>${data.planName}</strong> plan. Welcome to a more powerful OmniPDF experience!
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 0;">
              <p style="margin: 0 0 12px; color: #18181b; font-size: 16px; font-weight: 600;">
                Your new features:
              </p>
              ${(data.newFeatures || [])
                .map(
                  (feature: string) => `
                <p style="margin: 0 0 8px; color: #52525b; font-size: 14px; line-height: 1.5;">
                  <span style="color: #0ea5e9; margin-right: 8px;">✓</span>
                  ${feature}
                </p>
              `,
                )
                .join("")}
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${data.billingUrl || "https://omnipdf.com/dashboard"}" style="${buttonStyles}">
                View Your Plan
              </a>
            </td>
          </tr>
        </table>
      ${footerStyles}
    `,
    renderText: (data) => `
      Congratulations! You've upgraded to ${data.planName}

      Hi ${data.name || "there"}, you've successfully upgraded.

      Your new features:
      ${(data.newFeatures || []).map((feature: string) => `✓ ${feature}`).join("\n")}

      View your plan: ${data.billingUrl || "https://omnipdf.com/dashboard"}

      Best regards,
      The OmniPDF Team
    `,
  },

  "payment-failed": {
    subject: () => "Payment Failed - Action Required - OmniPDF",
    render: (data) => `
      ${baseStyles}
        <h2 style="margin: 0 0 20px; color: #ef4444; font-size: 24px; font-weight: 600;">
          Payment Failed ⚠️
        </h2>
        <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
          Hi ${data.name || "there"}, we were unable to process your payment of <strong>${data.amount}</strong>.
        </p>
        <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
          We'll try again on <strong>${data.nextAttemptDate}</strong>. Please update your payment method to avoid service interruption.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${data.updatePaymentUrl}" style="${buttonStyles}">
                Update Payment Method
              </a>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
          If you have any questions, please contact our support team.
        </p>
      ${footerStyles}
    `,
    renderText: (data) => `
      Payment Failed

      Hi ${data.name || "there"}, we were unable to process your payment of ${data.amount}.

      We'll try again on ${data.nextAttemptDate}. Please update your payment method.

      Update: ${data.updatePaymentUrl}

      Best regards,
      The OmniPDF Team
    `,
  },

  "storage-limit-warning": {
    subject: () => "Storage Limit Warning - OmniPDF",
    render: (data) => `
      ${baseStyles}
        <h2 style="margin: 0 0 20px; color: #f59e0b; font-size: 24px; font-weight: 600;">
          Storage Limit Warning ⚠️
        </h2>
        <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
          Hi ${data.name || "there"}, you're running low on cloud storage space.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 0;">
              <p style="margin: 0 0 8px; color: #92400e; font-size: 16px;">
                <strong>Current Usage:</strong> ${data.currentUsage}
              </p>
              <p style="margin: 0; color: #92400e; font-size: 16px;">
                <strong>Storage Limit:</strong> ${data.storageLimit}
              </p>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${data.upgradeUrl}" style="${buttonStyles}">
                Upgrade Storage
              </a>
            </td>
          </tr>
        </table>
      ${footerStyles}
    `,
    renderText: (data) => `
      Storage Limit Warning

      Hi ${data.name || "there"}, you're running low on cloud storage space.

      Current Usage: ${data.currentUsage}
      Storage Limit: ${data.storageLimit}

      Upgrade: ${data.upgradeUrl}

      Best regards,
      The OmniPDF Team
    `,
  },

  "security-alert": {
    subject: () => "Security Alert - Unusual Activity Detected - OmniPDF",
    render: (data) => `
      ${baseStyles}
        <h2 style="margin: 0 0 20px; color: #ef4444; font-size: 24px; font-weight: 600;">
          Security Alert 🛡️
        </h2>
        <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
          Hi ${data.name || "there"}, we detected unusual activity on your OmniPDF account.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fef2f2; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 0;">
              <p style="margin: 0 0 8px; color: #991b1b; font-size: 14px;">
                <strong>Activity:</strong> ${data.activity}
              </p>
              <p style="margin: 0 0 8px; color: #991b1b; font-size: 14px;">
                <strong>Location:</strong> ${data.location}
              </p>
              <p style="margin: 0 0 8px; color: #991b1b; font-size: 14px;">
                <strong>Time:</strong> ${data.time}
              </p>
              <p style="margin: 0; color: #991b1b; font-size: 14px;">
                <strong>Device:</strong> ${data.device}
              </p>
            </td>
          </tr>
        </table>
        <p style="margin: 0 0 24px; color: #52525b; font-size: 16px; line-height: 1.6;">
          If this was you, you can ignore this email. If you don't recognize this activity, please secure your account immediately.
        </p>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding: 20px 0;">
              <a href="${data.secureAccountUrl}" style="${buttonStyles} background: #ef4444;">
                Secure My Account
              </a>
            </td>
          </tr>
        </table>
      ${footerStyles}
    `,
    renderText: (data) => `
      Security Alert

      Hi ${data.name || "there"}, we detected unusual activity on your account.

      Activity: ${data.activity}
      Location: ${data.location}
      Time: ${data.time}
      Device: ${data.device}

      If this wasn't you, secure your account:
      ${data.secureAccountUrl}

      Best regards,
      The OmniPDF Team
    `,
  },
};
