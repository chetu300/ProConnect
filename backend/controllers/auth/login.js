import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { setAuthCookie } from "../../utils/generateToken.js";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    setAuthCookie(res, user._id);

    const safeUser = await User.findById(user._id).select(
      "-password"
    );

    return res.json(safeUser);
  } catch (error) {
    return res.status(500).json({
      message: "Could not login",
    });
  }
}
