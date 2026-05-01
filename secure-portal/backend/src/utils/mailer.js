const nodemailer = require('nodemailer');

// =======================
// 📩 Create Transporter
// =======================
const getTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};


// =======================
// 🔐 SEND OTP
// =======================
exports.sendOTP = async (email, otp) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"Secure Document Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP - Secure Document Portal',
    html: `
      <div style="font-family:Arial;max-width:400px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
        <div style="background:#003580;color:#fff;padding:16px 24px">
          <h2 style="margin:0">🏛️ Secure Document Portal</h2>
        </div>
        <div style="padding:24px">
          <p>Your One-Time Password is:</p>
          <h1 style="letter-spacing:8px;color:#003580">${otp}</h1>
          <p style="color:#888;font-size:13px">Valid for 5 minutes. Do not share.</p>
        </div>
      </div>
    `
  });

  console.log('📩 OTP sent to:', email);
};


// =======================
// 🔔 SEND EXPIRY NOTIFICATION
// =======================
exports.sendExpiryNotification = async (email, docName, expiresAt, secondsBefore) => {
  const transporter = getTransporter();

  const label =
    secondsBefore >= 60
      ? `${Math.floor(secondsBefore / 60)} minute(s)`
      : `${secondsBefore} seconds`;

  await transporter.sendMail({
    from: `"Secure Document Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `⚠️ Document Expiring Soon — ${docName}`,
    html: `
      <div style="font-family:Arial;max-width:400px;margin:auto;border:1px solid #ddd;border-radius:8px;overflow:hidden">
        <div style="background:#003580;color:#fff;padding:16px 24px">
          <h2 style="margin:0">🏛️ Secure Document Portal</h2>
        </div>
        <div style="padding:24px">
          <p>⚠️ Your document <b>${docName}</b> will expire in <b>${label}</b>.</p>
          <p>Expiry: <b>${new Date(expiresAt).toLocaleString()}</b></p>
          <p style="color:#888;font-size:12px">Please take action if needed.</p>
        </div>
      </div>
    `
  });

  console.log('🔔 Expiry notification sent to:', email);
};