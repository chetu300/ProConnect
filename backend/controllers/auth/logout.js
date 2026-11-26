import { getAuthCookieOptions } from "../../utils/generateToken.js";

export function logout(req, res) {
  res.clearCookie("token", getAuthCookieOptions());

  return res.json({
    message: "Logged out successfully",
  });
}
