// controllers/playerController.js
import Player from "../models/Player.js";
import Club from "../models/Club.js";
import multer from "multer";
import path from "path";
import fs from "fs";

export const createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json({ message: "Player deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current player's profile (creates if missing)
export const getMe = async (req, res) => {
  try {
    console.log("Getting player profile for user:", req.user._id);
    let player = await Player.findOne({ user: req.user._id });
    if (!player) {
      console.log("Creating new player profile for user:", req.user._id);
      player = await Player.create({ user: req.user._id });
    }
    console.log("Player profile found/created:", player);
    res.json(player);
  } catch (err) {
    console.error("Error in getMe:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update current player's profile (position, avatarUrl, coach linkage if needed)
export const updateMe = async (req, res) => {
  try {
    console.log("Updating player profile for user:", req.user._id);
    console.log("Update data:", req.body);
    
    const updates = {};
    if (req.body.position) updates.position = req.body.position;

    const player = await Player.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, upsert: true }
    );
    console.log("Player profile updated:", player);
    res.json(player);
  } catch (err) {
    console.error("Error in updateMe:", err);
    res.status(400).json({ message: err.message });
  }
};

// Accept base64 image and store to /uploads/players/:userId.png, update avatarUrl
// Multer storage for avatars
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.resolve("uploads", "players");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${String(req.user._id)}${ext}`);
  },
});

const avatarFileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowed.includes(file.mimetype)) return cb(new Error("Only PNG/JPEG allowed"));
  cb(null, true);
};

export const uploadAvatarMulter = multer({
  storage: avatarStorage,
  fileFilter: avatarFileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
}).single("avatar");

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const ext = path.extname(req.file.filename).toLowerCase() || ".jpg";
    const publicPath = `/uploads/players/${String(req.user._id)}${ext}`;
    const fullUrl = `${req.protocol}://${req.get("host")}${publicPath}`;

    const player = await Player.findOneAndUpdate(
      { user: req.user._id },
      { $set: { avatarUrl: fullUrl } },
      { new: true, upsert: true }
    );

    res.json({ success: true, avatarUrl: fullUrl, player });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get the club of the logged-in player
export const getMyClub = async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id }).populate({
      path: "club",
    });
    if (!player) return res.json(null); // no profile yet → treat as no club
    return res.json(player.club || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Join a club (sets player's club, pre-save hook updates Club.players)
export const joinClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const club = await Club.findById(clubId).select("_id");
    if (!club) return res.status(404).json({ message: "Club not found" });

    let player = await Player.findOne({ user: req.user._id });
    if (!player) {
      // auto-create player profile if missing
      player = await Player.create({ user: req.user._id, club: club._id });
      return res.json({ success: true });
    }

    player.club = club._id;
    await player.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
