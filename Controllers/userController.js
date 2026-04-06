import User from "../Models/User.js";
import Dashboard from "../Models/Dashboard.js";


//                   DASHBOARD VIEWING


// @route   GET /api/user/dashboards
// @access  User only
// Logic:
// - Find which manager created this user (createdBy)
// - Show all dashboards under that same manager only
// - Users under different managers cannot see each other's dashboards
export const getMyDashboards = async (req, res) => {
  // Get logged in user with their managerId (createdBy)
  const currentUser = await User.findById(req.user.id);

  if (!currentUser.createdBy) {
    return res.status(403).json({
      message: "You are not assigned to any manager",
    });
  }

  // Find all dashboards under same manager
  const dashboards = await Dashboard.find({
    managerId: currentUser.createdBy,
  })
    .populate("createdBy", "name email role")
    .populate("managerId", "name email");

  res.status(200).json({
    total: dashboards.length,
    managerId: currentUser.createdBy,
    dashboards,
  });
};

// @route   GET /api/user/dashboards/:id
// @access  User only
// Logic: User can view single dashboard only if under same manager
export const getDashboardById = async (req, res) => {
  const currentUser = await User.findById(req.user.id);

  if (!currentUser.createdBy) {
    return res.status(403).json({
      message: "You are not assigned to any manager",
    });
  }

  const dashboard = await Dashboard.findOne({
    _id: req.params.id,
    managerId: currentUser.createdBy, // must be under same manager
  })
    .populate("createdBy", "name email role")
    .populate("managerId", "name email");

  if (!dashboard) {
    return res.status(404).json({
      message: "Dashboard not found or you don't have access",
    });
  }

  res.status(200).json({ dashboard });
};

// @route   GET /api/user/profile
// @access  User only
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password")
    .populate("createdBy", "name email role");

  res.status(200).json({ user });
};

// @route   GET /api/user/teammates
// @access  User only
// Logic: See other users under the same manager
export const getTeammates = async (req, res) => {
  const currentUser = await User.findById(req.user.id);

  if (!currentUser.createdBy) {
    return res.status(403).json({
      message: "You are not assigned to any manager",
    });
  }

  const teammates = await User.find({
    role: "user",
    createdBy: currentUser.createdBy,
    _id: { $ne: req.user.id }, // exclude self
  }).select("-password");

  res.status(200).json({
    total: teammates.length,
    teammates,
  });
};