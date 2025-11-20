const verifyEmail = async (email, options) => {
  const senderEmail = process.env.BREVO_USER;         // Your Brevo sender email
  const apiKey = process.env.BREVO_SMTP_KEY;          // Brevo API key (NOT SMTP key)

  let subject, htmlContent;

  if (options.otp) {
    subject = "OTP Verification";
    htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #1a73e8;">OTP Verification</h2>
            <p>Your One-Time Password (OTP) is:</p>
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 10px 0;">${options.otp}</div>
            <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
        </div>`;
  } else {
    subject = "Password Reset Request";
    htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #1a73e8;">Password Reset Request</h2>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <div style="margin: 20px 0;">
                <a href="${options.reset_url}" 
                    style="background-color: #1a73e8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Reset Password
                </a>
            </div>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 15 minutes.</p>
        </div>`;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender: { email: senderEmail },
        to: [{ email }],
        subject,
        htmlContent
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Brevo API Error:", error);
      return false;
    }

    return true;

  } catch (err) {
    console.error("Brevo HTTP Error:", err);
    return false;
  }
};

module.exports = verifyEmail;
