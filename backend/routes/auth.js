import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = Router();
const makeToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const safeUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: "Name, email and password are required." });
    if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
    if (role && !["candidate", "employer"].includes(role)) return res.status(400).json({ message: "Invalid account role." });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: "Email is already registered." });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12), role: role || "candidate" });
    res.status(201).json({ token: makeToken(user), user: safeUser(user), message: "Account created successfully." });
  } catch (error) { next(error); }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(req.body.password || "", user.password))) return res.status(401).json({ message: "Email or password is incorrect." });
    res.json({ token: makeToken(user), user: safeUser(user), message: "Logged in successfully." });
  } catch (error) { next(error); }
});

router.get("/me", protect, (req, res) => res.json({ user: safeUser(req.user) }));
export default router;
