const nodemailer = require('nodemailer');

let transporter = null;

const initializeTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transport = initializeTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@todoapp.com',
      to,
      subject,
      html,
      text
    };

    const result = await transport.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

const sendReminderEmail = async (user, todo) => {
  const subject = `Reminder: ${todo.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #6366f1;">Todo Reminder</h2>
      <p>Hi ${user.name || 'there'},</p>
      <p>This is a reminder for your todo:</p>
      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px 0;">${todo.title}</h3>
        ${todo.description ? `<p style="color: #6b7280; margin: 0;">${todo.description}</p>` : ''}
        ${todo.dueDate ? `<p style="color: #ef4444; margin: 8px 0 0 0;"><strong>Due:</strong> ${new Date(todo.dueDate).toLocaleString()}</p>` : ''}
      </div>
      <p>Don't forget to complete this task!</p>
      <p style="color: #9ca3af; font-size: 12px;">This email was sent by Todo App</p>
    </div>
  `;
  const text = `Reminder: ${todo.title}\n\n${todo.description || ''}\n\nDue: ${todo.dueDate ? new Date(todo.dueDate).toLocaleString() : 'No due date'}`;

  return sendEmail({
    to: user.email,
    subject,
    html,
    text
  });
};

const sendDueSoonEmail = async (user, todo) => {
  const subject = `Due Soon: ${todo.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #f59e0b;">Todo Due Soon</h2>
      <p>Hi ${user.name || 'there'},</p>
      <p>Your todo is due soon:</p>
      <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px 0;">${todo.title}</h3>
        ${todo.description ? `<p style="color: #6b7280; margin: 0;">${todo.description}</p>` : ''}
        <p style="color: #d97706; margin: 8px 0 0 0;"><strong>Due:</strong> ${new Date(todo.dueDate).toLocaleString()}</p>
      </div>
      <p>Make sure to complete it on time!</p>
      <p style="color: #9ca3af; font-size: 12px;">This email was sent by Todo App</p>
    </div>
  `;
  const text = `Due Soon: ${todo.title}\n\n${todo.description || ''}\n\nDue: ${new Date(todo.dueDate).toLocaleString()}`;

  return sendEmail({
    to: user.email,
    subject,
    html,
    text
  });
};

module.exports = {
  sendEmail,
  sendReminderEmail,
  sendDueSoonEmail
};
