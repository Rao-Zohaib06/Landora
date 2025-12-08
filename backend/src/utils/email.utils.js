import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not configured. Skipping email send.');
      console.log('Would send email to:', to, 'Subject:', subject);
      return { success: true, message: 'Email skipped (not configured)' };
    }

    const mailOptions = {
      from: `"Landora" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

export const sendBookingConfirmation = async (user, plot) => {
  const subject = 'Plot Booking Confirmation - Landora';
  const html = `
    <h2>Booking Confirmation</h2>
    <p>Dear ${user.name},</p>
    <p>Your booking for Plot ${plot.plotNo} has been received.</p>
    <p><strong>Project:</strong> ${plot.projectId?.name || 'N/A'}</p>
    <p><strong>Plot Number:</strong> ${plot.plotNo}</p>
    <p><strong>Amount:</strong> PKR ${plot.price?.toLocaleString() || 'N/A'}</p>
    <p>We will review your booking and contact you shortly.</p>
    <p>Best regards,<br>Landora Team</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html,
  });
};

export const sendInstallmentReminder = async (user, installment) => {
  const subject = 'Installment Payment Reminder - Landora';
  const html = `
    <h2>Installment Payment Reminder</h2>
    <p>Dear ${user.name},</p>
    <p>This is a reminder that your installment payment is due soon.</p>
    <p><strong>Due Date:</strong> ${new Date(installment.dueDate).toLocaleDateString()}</p>
    <p><strong>Amount:</strong> PKR ${installment.amount?.toLocaleString() || 'N/A'}</p>
    <p>Please ensure payment is made before the due date to avoid late fees.</p>
    <p>Best regards,<br>Landora Team</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html,
  });
};

export const sendCommissionNotification = async (user, commission) => {
  const subject = 'Commission Approved - Landora';
  const html = `
    <h2>Commission Approved</h2>
    <p>Dear ${user.name},</p>
    <p>Your commission has been approved and will be processed shortly.</p>
    <p><strong>Amount:</strong> PKR ${commission.amount?.toLocaleString() || 'N/A'}</p>
    <p><strong>Status:</strong> ${commission.status}</p>
    <p>Best regards,<br>Landora Team</p>
  `;

  return await sendEmail({
    to: user.email,
    subject,
    html,
  });
};

