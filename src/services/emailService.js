import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export function send(email, subject = '', html = '') {
  return transport.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject,
    html,
  });
}

export function sendActivationMail(user) {
  const activationLink = `${process.env.CLIENT_URL}/activate/${user.activationToken}`

  return send(user.email, 'User activation', `
    <p>Please visit the link below to activate your account</p>
    <a href=${activationLink}>${activationLink}</a>
  `);
}
