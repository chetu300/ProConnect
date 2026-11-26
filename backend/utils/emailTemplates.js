export function welcomeEmail(name) {
  return {
    subject: "Welcome to ProConnect",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">Welcome to ProConnect!</h2>
        <p>Hi ${name},</p>
        <p>Your ProConnect account is ready.</p>
        <p>Complete your profile, connect with professionals,
        and share updates with your network.</p>
        <p>Welcome aboard,<br>The ProConnect Team</p>
      </div>
    `,
  };
}

export function passwordResetEmail(username, resetUrl) {
  return {
    subject: "Reset your ProConnect password",
    text: `Hi ${username},\n\nWe received a request to reset your ProConnect password. This link expires in one hour:\n${resetUrl}\n\nIf you did not request this, you can safely ignore this email.\nThe ProConnect Team`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#2563eb">Reset your password</h2>
        <p>Hi ${username},</p>
        <p>We received a request to reset your ProConnect password. This link expires in one hour.</p>
        <p><a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px">Reset password</a></p>
        <p>If the button is not visible, use this link: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p>The ProConnect Team</p>
      </div>
    `,
  };
}
