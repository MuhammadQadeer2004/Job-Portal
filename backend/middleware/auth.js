import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Please log in first." });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: "Account not found." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session invalid or expired. Please log in again." });
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission for this action." });
    }
    next();
  };
}
