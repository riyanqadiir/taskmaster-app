const nodemailer = require('nodemailer');

const verifyEmail = async (email, options) => {
  console.log(options.otp)
  const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,  // your email
    pass: process.env.BREVO_SMTP_KEY, // your SMTP key
  },
});

  let message;
  if (options.otp) {
    message = {
      from: process.env.BREVO_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your One-Time Password (OTP) is ${options.otp}. Please do not share it with anyone.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #1a73e8;">OTP Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 10px 0;">${options.otp}</div>
          <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
        </div>
      `
    };
  } else {
    message = {
      from: process.env.BREVO_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Click the following link to reset your password: ${options.reset_url}`,
      html: `
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
              </div>
          `
    }
  }


  try {
    const result = await transporter.sendMail(message);
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
};

module.exports = verifyEmail;
