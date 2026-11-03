const nodemailer = require('nodemailer');

/**
 * Escapes unsafe HTML characters to prevent XSS in email clients.
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Creates nodemailer transporter if SMTP credentials exist, else returns null.
 */
function getTransporter() {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
}

/**
 * Sends password reset email with secure 30-minute link.
 * Never includes raw password.
 */
async function sendPasswordResetEmail(admin, link) {
  const safeName = escapeHtml(admin.name || 'Admin');
  const safeLink = escapeHtml(link);
  const fromEmail = process.env.SMTP_FROM || 'no-reply@ytcglobal.com';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; }
          .header { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff !important; text-decoration: none; font-weight: 600; border-radius: 8px; margin: 20px 0; }
          .footer { margin-top: 24px; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Password Reset Request</div>
          <p>Hello ${safeName},</p>
          <p>A request was received to reset the password for your YTC Global Admin Portal account.</p>
          <p>Please click the button below to set a new password. This link is valid for <strong>30 minutes</strong>:</p>
          <p><a href="${safeLink}" class="button" target="_blank">Reset Password</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 13px; color: #2563eb;">${safeLink}</p>
          <div class="footer">
            <p>If you did not request this password reset, please ignore this email or notify your system administrator immediately.</p>
            <p>&copy; ${new Date().getFullYear()} YTC Global Overseas Education. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  if (transporter) {
    await transporter.sendMail({
      from: `"YTC Global Admin" <${fromEmail}>`,
      to: admin.email,
      subject: 'Password Reset Request - YTC Global Overseas Portal',
      html,
    });
  } else {
    // In dev / unconfigured SMTP, log securely to console
    console.log('\n=========================================');
    console.log('[EMAIL SERVICE - DEV LOG]');
    console.log(`To: ${admin.email}`);
    console.log('Subject: Password Reset Request - YTC Global Overseas Portal');
    console.log(`Reset Link: ${link}`);
    console.log('=========================================\n');
  }

  return { success: true };
}

/**
 * Sends staff invitation email with secure 24-hour setup link.
 * Never includes raw password.
 */
async function sendStaffInviteEmail(admin, link) {
  const safeName = escapeHtml(admin.name || 'Staff Member');
  const safeRole = escapeHtml(admin.role || 'Staff');
  const safeLink = escapeHtml(link);
  const fromEmail = process.env.SMTP_FROM || 'no-reply@ytcglobal.com';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; }
          .header { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
          .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: 600; background: #eff6ff; color: #1d4ed8; border-radius: 9999px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: #ffffff !important; text-decoration: none; font-weight: 600; border-radius: 8px; margin: 20px 0; }
          .footer { margin-top: 24px; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Welcome to YTC Global Admin Portal</div>
          <p>Hello ${safeName},</p>
          <p>You have been invited to join the YTC Global Overseas Portal with the role: <span class="badge">${safeRole}</span>.</p>
          <p>To activate your account and set your secure password, please click the button below. This activation link is valid for <strong>24 hours</strong>:</p>
          <p><a href="${safeLink}" class="button" target="_blank">Activate Account & Set Password</a></p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; font-size: 13px; color: #2563eb;">${safeLink}</p>
          <div class="footer">
            <p>For your security, you will be required to set your own password before gaining access.</p>
            <p>&copy; ${new Date().getFullYear()} YTC Global Overseas Education. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  if (transporter) {
    await transporter.sendMail({
      from: `"YTC Global Admin" <${fromEmail}>`,
      to: admin.email,
      subject: "You've been invited to YTC Global Overseas Admin Portal",
      html,
    });
  } else {
    // In dev / unconfigured SMTP, log securely to console
    console.log('\n=========================================');
    console.log('[EMAIL SERVICE - DEV LOG]');
    console.log(`To: ${admin.email}`);
    console.log("Subject: You've been invited to YTC Global Overseas Admin Portal");
    console.log(`Invite Link: ${link}`);
    console.log('=========================================\n');
  }

  return { success: true };
}

module.exports = {
  sendPasswordResetEmail,
  sendStaffInviteEmail,
};

