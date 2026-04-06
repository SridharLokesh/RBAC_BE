import User from "../Models/User.js";
import Dashboard from "../Models/Dashboard.js";

// ═══════════════════════════════════════════════════════════════
//                     MANAGER MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// @route   POST /api/admin/managers
// @access  Admin only
export const createManager = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const manager = await User.create({
    name,
    email,
    password,
    role: "manager",
    createdBy: req.user.id,
  });

  res.status(201).json({
    message: "Manager created successfully",
    manager: {
      id: manager._id,
      name: manager.name,
      email: manager.email,
      role: manager.role,
      createdBy: manager.createdBy,
    },
  });
};

// @route   GET /api/admin/managers
// @access  Admin only
export const getAllManagers = async (req, res) => {
  const managers = await User.find({ role: "manager" })
    .select("-password")
    .populate("createdBy", "name email");

  res.status(200).json({
    total: managers.length,
    managers,
  });
};

// @route   PUT /api/admin/managers/:id
// @access  Admin only
export const updateManager = async (req, res) => {
  const { name, email } = req.body;

  const manager = await User.findOne({ _id: req.params.id, role: "manager" });
  if (!manager) {
    return res.status(404).json({ message: "Manager not found" });
  }

  if (name) manager.name = name;
  if (email) manager.email = email;

  await manager.save();

  res.status(200).json({
    message: "Manager updated successfully",
    manager: {
      id: manager._id,
      name: manager.name,
      email: manager.email,
      role: manager.role,
    },
  });
};

// @route   DELETE /api/admin/managers/:id
// @access  Admin only
export const deleteManager = async (req, res) => {
  const manager = await User.findOne({ _id: req.params.id, role: "manager" });
  if (!manager) {
    return res.status(404).json({ message: "Manager not found" });
  }

  // Delete all users under this manager
  await User.deleteMany({ createdBy: manager._id, role: "user" });

  // Delete all dashboards under this manager
  await Dashboard.deleteMany({ managerId: manager._id });

  await manager.deleteOne();

  res.status(200).json({
    message: "Manager and all associated users & dashboards deleted",
  });
};

// ═══════════════════════════════════════════════════════════════
//                      USER MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// @route   POST /api/admin/users
// @access  Admin only
export const createUser = async (req, res) => {
  const { name, email, password, managerId } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  // Validate manager if provided
  if (managerId) {
    const manager = await User.findOne({ _id: managerId, role: "manager" });
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "user",
    createdBy: managerId || null,
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

// @route   GET /api/admin/users
// @access  Admin only
export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" })
    .select("-password")
    .populate("createdBy", "name email");

  res.status(200).json({
    total: users.length,
    users,
  });
};

// @route   PUT /api/admin/users/:id
// @access  Admin only
export const updateUser = async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findOne({ _id: req.params.id, role: "user" });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
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

// @route   DELETE /api/admin/users/:id
// @access  Admin only
export const deleteUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: "user" });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  await user.deleteOne();

  res.status(200).json({ message: "User deleted successfully" });
};

// ═══════════════════════════════════════════════════════════════
//                   DASHBOARD MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// @route   POST /api/admin/dashboards
// @access  Admin only
export const createDashboard = async (req, res) => {
  const { title, description, managerId } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Please provide dashboard title" });
  }

  const dashboard = await Dashboard.create({
    title,
    description: description || "",
    createdBy: req.user.id,
    managerId: managerId || null,
  });

  res.status(201).json({
    message: "Dashboard created successfully",
    dashboard,
  });
};

// @route   GET /api/admin/dashboards
// @access  Admin only
export const getAllDashboards = async (req, res) => {
  const dashboards = await Dashboard.find()
    .populate("createdBy", "name email role")
    .populate("managerId", "name email");

  res.status(200).json({
    total: dashboards.length,
    dashboards,
  });
};

// @route   PUT /api/admin/dashboards/:id
// @access  Admin only
export const updateDashboard = async (req, res) => {
  const { title, description } = req.body;

  const dashboard = await Dashboard.findById(req.params.id);
  if (!dashboard) {
    return res.status(404).json({ message: "Dashboard not found" });
  }

  if (title) dashboard.title = title;
  if (description) dashboard.description = description;

  await dashboard.save();

  res.status(200).json({
    message: "Dashboard updated successfully",
    dashboard,
  });
};

// @route   DELETE /api/admin/dashboards/:id
// @access  Admin only
export const deleteDashboard = async (req, res) => {
  const dashboard = await Dashboard.findById(req.params.id);
  if (!dashboard) {
    return res.status(404).json({ message: "Dashboard not found" });
  }

  await dashboard.deleteOne();

  res.status(200).json({ message: "Dashboard deleted successfully" });
};