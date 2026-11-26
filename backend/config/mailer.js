import nodemailer from "nodemailer";

export function createMailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  const pass =
    SMTP_HOST.toLowerCase() === "smtp.gmail.com"
      ? SMTP_PASS.replace(/\s/g, "")
      : SMTP_PASS;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    auth: {
      user: SMTP_USER,
      pass,
    },
  });
}

export async function sendEmail({ to, subject, html, text }) {
  const mailer = createMailer();

  if (!mailer) {
    throw new Error("SMTP configuration is incomplete");
  }

  const from = process.env.SMTP_FROM || "ProConnect <noreply@proconnect.app>";

  return mailer.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
}
