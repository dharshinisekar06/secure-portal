const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP } = require('../utils/mailer');


// =======================
// 🔐 SEND OTP
// =======================
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Expiry: 10 minutes
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save or update user
    await User.findOneAndUpdate(
      { email },
      { otp, otpExpiry, name },
      { upsert: true, returnDocument: 'after' }
    );

    console.log("📩 OTP generated:", otp);

    // Send OTP email
    await sendOTP(email, otp);

    res.json({ message: 'OTP sent successfully' });

  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ✅ VERIFY OTP
// =======================
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });

    // ❌ User not found
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // ❌ No OTP
    if (!user.otp) {
      return res.status(400).json({
        error: 'OTP already used or not generated. Please resend OTP.'
      });
    }

    console.log("👉 Entered OTP:", otp);
    console.log("👉 Stored OTP:", user.otp);

    // ❌ Invalid OTP
    if (user.otp.toString() !== otp.toString()) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // ❌ Expired OTP
    if (user.otpExpiry && user.otpExpiry < Date.now()) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // ✅ Success
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    // 🔥 UPDATED: include role in token
    const token = jwt.sign(
      {
        userId: user._id,
        email,
        role: user.role || 'user' // fallback if role not set
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('✅ TOKEN GENERATED:', token);

    // 🔥 UPDATED: include role in response
    res.json({
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      }
    });

  } catch (err) {
    console.error('FULL ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;