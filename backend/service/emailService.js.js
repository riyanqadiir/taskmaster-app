const verifyEmail = async (email, options) => {
  const senderEmail = process.env.BREVO_SENDER;  
  const apiKey = process.env.BREVO_API_KEY;

  let subject, htmlContent;

  if (options.otp) {
    subject = "OTP Verification";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #1a73e8;">OTP Verification</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 10px 0;">
          ${options.otp}
        </div>
        <p>This OTP is valid for 10 minutes. Do NOT share it.</p>
      </div>`;
  } else {
    subject = "Password Reset Request";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #1a73e8;">Password Reset Request</h2>
        <p>Click below to reset your password:</p>
        <a href="${options.reset_url}" 
           style="background:#1a73e8; color:#fff; padding:12px 24px; border-radius:4px;">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
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
