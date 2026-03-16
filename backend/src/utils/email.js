const transporter = require('../config/smtp');

const sendResetPasswordEmail = async (to, link) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: 'Сброс пароля',
    html: `<p>Для сброса пароля перейдите по ссылке: <a href="${link}">${link}</a></p>`,
  };
  await transporter.sendMail(mailOptions);
};

const sendCredentialsEmail = async (to, password) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: 'Ваши учётные данные',
    html: `<p>Ваш пароль для входа: <strong>${password}</strong></p><p>Рекомендуем сменить его после первого входа.</p>`,
  };
  await transporter.sendMail(mailOptions);
};

const generateRandomPassword = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
};

module.exports = { sendResetPasswordEmail, sendCredentialsEmail, generateRandomPassword };
