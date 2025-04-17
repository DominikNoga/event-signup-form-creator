const nodemailer = require('nodemailer');

let transporter;
const verificationStore = {};

const createTransporter = async () => {
  if (transporter) return transporter;

  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return transporter;
};

exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationStore[email] = code;

  try {
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: '"Conference App" <no-reply@conference.com>',
      to: email,
      subject: 'Your Verification Code',
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });

    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    res.json({ message: 'Verification code sent (check console for preview link).' });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ message: 'Failed to send email.' });
  }
};

exports.verifyCode = (req, res) => {
  const { email, code } = req.body;
  if (verificationStore[email] === code) {
    delete verificationStore[email];
    res.json({ verified: true });
  } else {
    res.status(400).json({ message: 'Invalid or expired code' });
  }
};
