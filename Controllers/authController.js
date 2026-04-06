import jwt from "jsonwebtoken";
import User from "../Models/User.js";

// ─── Generate JWT Token ───────────────────────────────────────────────────────
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// ─── Format User Response ─────────────────────────────────────────────────────
const formatUser = (user, token) => ({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdBy: user.createdBy,
  },
});

// ─── Register Admin ───────────────────────────────────────────────────────────
// @route   POST /api/auth/register-admin
// @access  Public (first time setup only)
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const admin = await User.create({
    name,
    email,
    password,
    role: "admin",
    createdBy: null,
  });

  const token = generateToken(admin._id, admin.role);

  res.status(201).json({
    message: "Admin registered successfully",
    ...formatUser(admin, token),
  });
};

// ─── Login ────────────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public (Admin / Manager / User)
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json({
    message: `${user.role} logged in successfully`,
    ...formatUser(user, token),
  });
};

// ─── Get Logged In User Profile ───────────────────────────────────────────────
// @route   GET /api/auth/me
// @access  Protected
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ user });
};