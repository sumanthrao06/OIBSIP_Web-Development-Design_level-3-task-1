import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // If SMTP credentials are not configured, log to console
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.log('\n==================================================');
    console.log(`[EMAIL SEND SIMULATION] To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: \n${options.message}`);
    console.log('==================================================\n');
    return { success: true, message: 'Email logged in console successfully (development mode)' };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const mailOptions = {
    from: `"SliceCraft Pizza" <noreply@slicecraft.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
