import User from "../Models/User.js";
import Dashboard from "../Models/Dashboard.js";

// ═══════════════════════════════════════════════════════════════
//                     USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// @route   POST /api/manager/users
// @access  Manager only
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "user",
    createdBy: req.user.id, // manager's id
  });

  res.status(201).json({
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdBy: user.createdBy,
    },
  });
};

// @route   GET /api/manager/users
// @access  Manager only
export const getMyUsers = async (req, res) => {
  const users = await User.find({
    role: "user",
    createdBy: req.user.id,
  }).select("-password");

  res.status(200).json({
    total: users.length,
    users,
  });
};

// @route   PUT /api/manager/users/:id
// @access  Manager only
export const updateUser = async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findOne({
    _id: req.params.id,
    role: "user",
    createdBy: req.user.id, // only update own users
  });

  if (!user) {
    return res.status(404).json({ message: "User not found under your account" });
  }

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    message: "User updated successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// @route   DELETE /api/manager/users/:id
// @access  Manager only
export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    _id: req.params.id,
    role: "user",
    createdBy: req.user.id, // only delete own users
  });

  if (!user) {
    return res.status(404).json({ message: "User not found under your account" });
  }

  await user.deleteOne();

  res.status(200).json({ message: "User deleted successfully" });
};

// ═══════════════════════════════════════════════════════════════
//                   DASHBOARD MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// @route   POST /api/manager/dashboards
// @access  Manager only
export const createDashboard = async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Please provide dashboard title" });
  }

  const dashboard = await Dashboard.create({
    title,
    description: description || "",
    createdBy: req.user.id,
    managerId: req.user.id, // always this manager
  });

  res.status(201).json({
    message: "Dashboard created successfully",
    dashboard,
  });
};

// @route   GET /api/manager/dashboards
// @access  Manager only
export const getMyDashboards = async (req, res) => {
  const dashboards = await Dashboard.find({
    managerId: req.user.id,
  }).populate("createdBy", "name email role");

  res.status(200).json({
    total: dashboards.length,
    dashboards,
  });
};

// @route   PUT /api/manager/dashboards/:id
// @access  Manager only
export const updateDashboard = async (req, res) => {
  const { title, description } = req.body;

  const dashboard = await Dashboard.findOne({
    _id: req.params.id,
    managerId: req.user.id, // only update own dashboards
  });

  if (!dashboard) {
    return res.status(404).json({ message: "Dashboard not found under your account" });
  }

  if (title) dashboard.title = title;
  if (description) dashboard.description = description;

  await dashboard.save();

  res.status(200).json({
    message: "Dashboard updated successfully",
    dashboard,
  });
};

// @route   DELETE /api/manager/dashboards/:id
// @access  Manager only
export const deleteDashboard = async (req, res) => {
  const dashboard = await Dashboard.findOne({
    _id: req.params.id,
    managerId: req.user.id, // only delete own dashboards
  });

  if (!dashboard) {
    return res.status(404).json({ message: "Dashboard not found under your account" });
  }

  await dashboard.deleteOne();

  res.status(200).json({ message: "Dashboard deleted successfully" });
};