import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { sendEmail } from "../../config/mailer.js";
import { passwordResetEmail } from "../../utils/emailTemplates.js";

function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getResetPageOrigin(req) {
  const configuredUrl = new URL(
    process.env.CLIENT_URL || "http://localhost:5173"
  );

  if (process.env.NODE_ENV === "production") {
    return configuredUrl.origin;
  }

  const requestOrigin = req.get("origin");
  if (requestOrigin) {
    const requestUrl = new URL(requestOrigin);
    if (
      requestUrl.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(requestUrl.hostname)
    ) {
      if (requestUrl.hostname === "localhost") {
        requestUrl.hostname = "127.0.0.1";
      }
      return requestUrl.origin;
    }
  }

  if (
    configuredUrl.protocol === "http:" &&
    configuredUrl.hostname === "localhost"
  ) {
    configuredUrl.hostname = "127.0.0.1";
  }
  return configuredUrl.origin;
}

export async function forgotPassword(req, res) {
  let stage = "validating request";

  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    stage = "looking up account";
    const user = await User.findOne({ email });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const resetPasswordToken = hashResetToken(token);
      const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      stage = "saving reset token";
      const updateResult = await User.updateOne(
        { _id: user._id },
        { $set: { resetPasswordToken, resetPasswordExpires } }
      );
      if (!updateResult.matchedCount) {
        throw new Error("User account no longer exists");
      }

      const resetUrl = `${getResetPageOrigin(req)}/reset-password/${token}`;
      stage = "sending reset email";
      try {
        const emailContent = passwordResetEmail(user.username, resetUrl);
        await sendEmail({
          to: user.email,
          subject: emailContent.subject,
          html: emailContent.html,
          text: emailContent.text,
        });
      } catch (emailError) {
        console.error("Password reset email failed:", emailError.message);
        await User.updateOne(
          { _id: user._id, resetPasswordToken },
          { $unset: { resetPasswordToken: "", resetPasswordExpires: "" } }
        );
        return res.status(503).json({
          message: "Could not send the reset email. Please try again later.",
        });
      }
    }

    return res.json({
      message: "If an account exists for that email, a reset link has been sent. Check your inbox and spam folder.",
    });
  } catch (error) {
    console.error(`Could not process password reset request while ${stage}:`, error);
    return res.status(500).json({ message: "Could not process password reset request" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Reset token and new password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must have at least 6 characters" });
    }

    const hashedToken = hashResetToken(token);
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updateResult = await User.updateOne(
      {
        _id: user._id,
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
      },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
      }
    );
    if (!updateResult.matchedCount) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }

    return res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Could not reset password:", error);
    return res.status(500).json({ message: "Could not reset password" });
  }
}
