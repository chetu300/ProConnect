import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../../models/User.js";
import { setAuthCookie } from "../../utils/generateToken.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

function makeUsername(email) {
  const baseName = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return `${baseName}${Math.floor(Math.random() * 9000) + 1000}`;
}

export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const profile = ticket.getPayload();
    if (!profile?.email || !profile.email_verified) {
      return res.status(400).json({
        message: "Google email could not be verified",
      });
    }

    let user = await User.findOne({
      email: profile.email.toLowerCase(),
    });

    if (!user) {
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36),
        10
      );

      user = await User.create({
        name: profile.name || "ProConnect User",
        username: makeUsername(profile.email),
        email: profile.email,
        password: randomPassword,
        profileImage: profile.picture || "",
      });
    }

    setAuthCookie(res, user._id);
    const safeUser = await User.findById(user._id).select(
      "-password"
    );

    return res.json(safeUser);
  } catch (error) {
    return res.status(401).json({
      message: "Google login failed",
    });
  }
}
