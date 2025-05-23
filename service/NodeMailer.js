const nodemailer = require('nodemailer');

const verifyEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.TASK_MASTER_GMAIL,
      pass: process.env.TASK_MASTER_APP_PASS
    }
  });

  const message = {
    from: process.env.TASK_MASTER_GMAIL,
    to: email,
    subject: "OTP Verification",
    text: `Your One-Time Password (OTP) is ${otp}. Please do not share it with anyone.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #1a73e8;">OTP Verification</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 10px 0;">${otp}</div>
        <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
      </div>
    `
  };

  try {
    const result = await transporter.sendMail(message);
    console.log("Email sent:", result.response);
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
};

module.exports = verifyEmail;
