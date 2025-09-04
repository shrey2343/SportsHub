// backend/controllers/adminController.js
import User from "../models/User.js";
import Coach from "../models/Coach.js";
import Player from "../models/Player.js";
import Club from "../models/Club.js";
import Payment from "../models/Payment.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getAIResponse } from "../utils/aiHelper.js";
import bcrypt from "bcryptjs";

// Create a new admin
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ success: false, message: "Admin with this email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = await User.create({ name, email, password: hashed, role: "admin" });

  const aiMessage = await getAIResponse(`Write a short professional welcome for new sports admin ${name}.`);

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin: { id: admin._id, name, email },
    aiMessage,
  });
});

// Get all admins
export const getAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: "admin" }).select("name email");
  res.status(200).json({ success: true, admins });
});

// Get single admin by ID
export const getAdminById = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.params.id).select("name email role");
  if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
  res.json({ success: true, admin });
});

// Update admin
export const updateAdmin = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const admin = await User.findByIdAndUpdate(
    req.params.id,
    { name, email },
    { new: true, runValidators: true }
  );
  if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
  res.json({ success: true, admin });
});

// Delete admin
export const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await User.findByIdAndDelete(req.params.id);
  if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
  res.json({ success: true, message: "Admin deleted successfully" });
});

// Get all coaches for admin
export const listCoaches = asyncHandler(async (req, res) => {
  const coaches = await Coach.find().populate("user", "name email role");
  res.status(200).json({ success: true, coaches });
});

// Get all players for admin
export const listPlayers = asyncHandler(async (req, res) => {
  const players = await Player.find()
    .populate("user", "name email role")
    .populate({ path: "coach", populate: { path: "user", select: "name email" } });
  res.status(200).json({ success: true, players });
});

// Get all clubs for admin
export const listClubs = asyncHandler(async (req, res) => {
  const clubs = await Club.find().populate("sport", "name");
  res.status(200).json({ success: true, clubs });
});

// Remove coach
export const removeCoach = asyncHandler(async (req, res) => {
  const coach = await Coach.findByIdAndDelete(req.params.id);
  if (!coach) return res.status(404).json({ success: false, message: "Coach not found" });
  await User.findByIdAndDelete(coach.user);
  res.json({ success: true, message: "Coach and linked user deleted successfully" });
});

// Remove player
export const removePlayer = asyncHandler(async (req, res) => {
  const player = await Player.findByIdAndDelete(req.params.id);
  if (!player) return res.status(404).json({ success: false, message: "Player not found" });
  await User.findByIdAndDelete(player.user);
  res.json({ success: true, message: "Player and linked user deleted successfully" });
});

// Toggle user status (active/suspended)
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { userType, userId } = req.params;
  
  let user;
  if (userType === 'coaches') {
    user = await Coach.findById(userId).populate('user');
    if (user) {
      user.user.status = status;
      await user.user.save();
    }
  } else if (userType === 'players') {
    user = await Player.findById(userId).populate('user');
    if (user) {
      user.user.status = status;
      await user.user.save();
    }
  }
  
  if (!user) {
    return res.status(404).json({ success: false, message: `${userType} not found` });
  }
  
  res.json({ success: true, message: `User status updated to ${status}` });
});

// Get all payments for admin
export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate('user', 'name email')
    .populate('club', 'name')
    .sort({ createdAt: -1 });
  
  res.status(200).json({ success: true, payments });
});

// Get system reports for admin
export const getReports = asyncHandler(async (req, res) => {
  // Generate system reports
  const totalUsers = await User.countDocuments();
  const totalPlayers = await Player.countDocuments();
  const totalCoaches = await Coach.countDocuments();
  const totalClubs = await Club.countDocuments();
  const totalPayments = await Payment.countDocuments();
  
  const reports = [
    {
      id: 1,
      title: 'User Registration Report',
      description: 'Total users registered in the system',
      data: { totalUsers, totalPlayers, totalCoaches },
      type: 'user',
      generatedAt: new Date()
    },
    {
      id: 2,
      title: 'Club Management Report',
      description: 'Total clubs and their status',
      data: { totalClubs },
      type: 'club',
      generatedAt: new Date()
    },
    {
      id: 3,
      title: 'Financial Report',
      description: 'Payment and revenue summary',
      data: { totalPayments },
      type: 'financial',
      generatedAt: new Date()
    }
  ];
  
  res.status(200).json({ success: true, reports });
});

// Get pending approvals for admin
export const getPendingApprovals = asyncHandler(async (req, res) => {
  const pendingClubs = await Club.find({ status: 'pending' })
    .populate({
      path: 'coach',
      populate: { path: 'user', select: 'name email' }
    })
    .sort({ createdAt: -1 });
  
  const approvals = pendingClubs.map(club => ({
    _id: club._id,
    clubId: club._id,
    clubName: club.name,
    requestType: 'Club Registration',
    coachName: club.coach?.user?.name || 'Unknown Coach',
    sport: club.sport || 'Unknown Sport',
    location: club.location || 'Unknown Location',
    description: club.description || 'No description provided',
    registrationFee: club.registrationFee || 0,
    maxPlayers: club.maxPlayers || 'Unlimited',
    createdAt: club.createdAt
  }));
  
  res.status(200).json({ success: true, approvals });
});

// Approve club
export const approveClub = asyncHandler(async (req, res) => {
  const club = await Club.findByIdAndUpdate(
    req.params.clubId,
    { status: 'approved' },
    { new: true }
  );
  
  if (!club) {
    return res.status(404).json({ success: false, message: 'Club not found' });
  }
  
  res.json({ success: true, message: 'Club approved successfully', club });
});

// Reject club
export const rejectClub = asyncHandler(async (req, res) => {
  const club = await Club.findByIdAndUpdate(
    req.params.clubId,
    { status: 'rejected' },
    { new: true }
  );
  
  if (!club) {
    return res.status(404).json({ success: false, message: 'Club not found' });
  }
  
  res.json({ success: true, message: 'Club rejected successfully', club });
});
