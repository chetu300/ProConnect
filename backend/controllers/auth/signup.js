import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { setAuthCookie } from "../../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must have at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    setAuthCookie(res, user._id);

    const safeUser = await User.findById(user._id).select(
      "-password"
    );

    return res.status(201).json(safeUser);
  } catch (error) {
    return res.status(500).json({
      message: "Could not create account",
    });
  }
}
