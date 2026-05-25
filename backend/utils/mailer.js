const nodemailer = require("nodemailer");

/**
 * Sends a password reset email to the specified user email address.
 * Fails gracefully (and logs to console) if SMTP configurations are missing.
 * 
 * @param {string} to - Recipient email.
 * @param {string} otp - The 6-digit verification code.
 */
async function sendOTPEmail(to, otp) {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  console.log(`\n======================================================`);
  console.log(`🔑 [OTP RESET CODE FOR TESTING]`);
  console.log(`   To:      ${to}`);
  console.log(`   OTP:     ${otp}`);
  console.log(`======================================================\n`);

  if (!host || !user || !pass) {
    console.log(
      "[MAILER INFO] SMTP credentials not fully configured in .env. Skipping real email send."
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  const mailOptions = {
    from: `"Medlink Support" <${user}>`,
    to,
    subject: "Reset Your Medlink Password - Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #0f766e; text-align: center; margin-bottom: 5px;">Medlink</h2>
        <p style="font-size: 14px; color: #64748b; text-align: center; margin-top: 0;">Healthcare Companion</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;"/>
        <p>Hello,</p>
        <p>We received a request to reset the password associated with your Medlink account. Please use the following 6-digit verification code to complete the request:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #0f766e; letter-spacing: 5px; padding: 10px 20px; background-color: #ccfbf1; border-radius: 4px; display: inline-block;">${otp}</span>
        </div>
        <p style="color: #475569; font-size: 14px;">This code will expire in <strong>15 minutes</strong>. If you did not make this request, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px; margin-bottom: 20px;"/>
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">Medlink Healthcare App &copy; 2026</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER SUCCESS] Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error(`[MAILER ERROR] Failed to send email to ${to}:`, error.message);
  }
}

module.exports = { sendOTPEmail };
