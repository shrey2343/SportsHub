// controllers/clubController.js
import Club from "../models/Club.js";
import Coach from "../models/Coach.js";
import Sport from "../models/Sport.js";

export const createClub = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Only coaches can create clubs; ensure we have a Coach profile
    const coachProfile = await Coach.findOne({ user: req.user._id });
    if (!coachProfile) {
      return res.status(403).json({ message: "Only coaches can create clubs" });
    }

    const {
      name,
      location,
      registrationFee,
      fee,
      sport,
      sportId,
      description,
      maxPlayers,
      facilities,
    } = req.body;

    // Normalize fields from various frontend forms
    const normalizedRegistrationFee = Number(
      registrationFee ?? fee ?? 0
    );
    let normalizedSport = sport ?? sportId; // frontend might send sportId

    // If sport is sent as an ObjectId (from sports list), resolve to sport name
    const looksLikeObjectId = (val) =>
      typeof val === "string" && /^[a-f\d]{24}$/i.test(val);

    if (!sport && sportId && looksLikeObjectId(sportId)) {
      const sportDoc = await Sport.findById(sportId);
      if (!sportDoc) {
        return res.status(400).json({ message: "Invalid sportId" });
      }
      normalizedSport = sportDoc.name;
    }

    // Also handle case where `sport` itself is an id
    if (sport && looksLikeObjectId(sport)) {
      const sportDoc = await Sport.findById(sport);
      if (!sportDoc) {
        return res.status(400).json({ message: "Invalid sport" });
      }
      normalizedSport = sportDoc.name;
    }

    if (!name || !location || !normalizedSport) {
      return res.status(400).json({
        message: "name, location, and sport are required",
      });
    }

    const clubPayload = {
      name: String(name).trim(),
      location: String(location).trim(),
      registrationFee: isNaN(normalizedRegistrationFee)
        ? 0
        : normalizedRegistrationFee,
      sport: normalizedSport,
      coach: coachProfile._id,
      description: description ? String(description).trim() : undefined,
      maxPlayers: maxPlayers ? Number(maxPlayers) : undefined,
      facilities: facilities ? String(facilities).trim() : undefined,
      status: 'pending' // All coach-created clubs start as pending
    };

    // Check if club name already exists (case-insensitive)
    const existingClub = await Club.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingClub) {
      return res.status(409).json({
        success: false,
        message: `A club with the name "${name}" already exists. Please choose a different name.`
      });
    }
    
    const club = await Club.create(clubPayload);
    
    // Return success response with club data
    res.status(201).json({
      success: true,
      message: 'Club created successfully and pending admin approval',
      club: {
        _id: club._id,
        name: club.name,
        sport: club.sport,
        location: club.location,
        registrationFee: club.registrationFee,
        status: club.status,
        description: club.description,
        maxPlayers: club.maxPlayers,
        facilities: club.facilities,
        coach: club.coach,
        createdAt: club.createdAt
      }
    });
  } catch (err) {
    console.error("❌ Error creating club:", err);
    const status = err?.code === 11000 ? 409 : 400; // duplicate key -> conflict
    res.status(status).json({ message: err.message });
  }
};

export const getClubs = async (req, res) => {
  try {
    let query = {};
    
    // If user is not admin or coach, only show approved clubs
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'coach')) {
      query.status = 'approved';
    }
    
    // Find clubs based on query and populate players enrolled in each club
    const clubs = await Club.find(query)
      .populate({
        path: "coach",
        populate: { path: "user", select: "name email role" } // fetch User inside Coach
      })
      .populate({
        path: "players",
        populate: { path: "user", select: "name email role" } // fetch User inside Player
      });

    // If user is authenticated, check membership status (supports multi-club)
    if (req.user) {
      const Player = (await import("../models/Player.js")).default;
      const player = await Player.findOne({ user: req.user._id }).select("club clubs");
      const clubIdSet = new Set((player?.clubs || []).map(c => String(c)));

      const clubsWithMembership = clubs.map(club => ({
        ...club.toObject(),
        isMember: clubIdSet.has(String(club._id)) || (player && player.club && String(player.club) === String(club._id))
      }));
      
      return res.json(clubsWithMembership);
    }

    res.json(clubs);
  } catch (err) {
    console.error("❌ Error in getClubs:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get clubs owned by the logged-in coach (or all if admin)
export const getMyClubs = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    let query = {};
    if (req.user.role !== 'admin') {
      const coachProfile = await Coach.findOne({ user: req.user._id }).select('_id');
      if (!coachProfile) return res.status(403).json({ message: "Only coaches/admins can view owned clubs" });
      query.coach = coachProfile._id;
    }

    const clubs = await Club.find(query)
      .populate({
        path: "coach",
        populate: { path: "user", select: "name email role" }
      })
      .populate({
        path: "players",
        populate: { path: "user", select: "name email role" }
      });

    res.json(clubs);
  } catch (err) {
    console.error("❌ Error in getMyClubs:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: "Club not found" });
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateClub = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const { status, ...updateData } = req.body;
    
    // Only admins can change club status
    if (status && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can change club status" });
    }
    
    // Coaches can only update their own clubs (except status)
    if (req.user.role === 'coach') {
      const coachProfile = await Coach.findOne({ user: req.user._id });
      if (!coachProfile) {
        return res.status(403).json({ message: "Coach profile not found" });
      }
      
      const existingClub = await Club.findById(req.params.id).select('coach');
      if (!existingClub) {
        return res.status(404).json({ message: "Club not found" });
      }
      
      if (String(existingClub.coach) !== String(coachProfile._id)) {
        return res.status(403).json({ message: "You can only update your own clubs" });
      }
    }

    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!club) return res.status(404).json({ message: "Club not found" });
    
    res.json({
      success: true,
      message: "Club updated successfully",
      club
    });
  } catch (err) {
    console.error("❌ Error updating club:", err);
    res.status(400).json({ message: err.message });
  }
};

export const deleteClub = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const coachProfile = await Coach.findOne({ user: req.user._id });
    if (!coachProfile && req.user.role !== 'admin') {
      return res.status(403).json({ message: "Only coaches/admins can delete clubs" });
    }

    const club = await Club.findById(req.params.id).select("coach");
    if (!club) return res.status(404).json({ message: "Club not found" });

    if (req.user.role !== 'admin' && String(club.coach) !== String(coachProfile._id)) {
      return res.status(403).json({ message: "Forbidden: not your club" });
    }

    // Detach players from this club
    const Player = (await import("../models/Player.js")).default;
    await Player.updateMany({ club: club._id }, { $set: { club: null } });

    await Club.findByIdAndDelete(club._id);
    res.json({ success: true, message: "Club deleted" });
  } catch (err) {
    console.error("❌ Error deleting club:", err);
    res.status(500).json({ message: err.message });
  }
};

// Remove a player from a club (coach-owned)
export const removePlayerFromClub = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const { clubId, playerId } = req.params;

    // Ensure requesting user is the coach of the club
    const coachProfile = await Coach.findOne({ user: req.user._id });
    if (!coachProfile) return res.status(403).json({ message: "Only coaches can manage players" });

    const club = await Club.findById(clubId).select("coach players");
    if (!club) return res.status(404).json({ message: "Club not found" });
    if (String(club.coach) !== String(coachProfile._id)) {
      return res.status(403).json({ message: "Forbidden: not your club" });
    }

          // Ensure the player belongs to this club
      const Player = (await import("../models/Player.js")).default;
      const player = await Player.findById(playerId).select("club");
    if (!player) return res.status(404).json({ message: "Player not found" });
    if (!player.club || String(player.club) !== String(clubId)) {
      return res.status(400).json({ message: "Player is not in this club" });
    }

    // Remove player by clearing their club; pre-save hook syncs Club.players
    player.club = null;
    await player.save();

          return res.json({ success: true, message: "Player removed from club successfully" });
  } catch (err) {
    console.error("❌ Error removing player from club:", err);
    res.status(500).json({ message: err.message });
  }
};

// Leave a club (player self-service)
export const leaveClub = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });

    const { clubId } = req.params;

    // Find the player profile
    const Player = (await import("../models/Player.js")).default;
    const player = await Player.findOne({ user: req.user._id });
    if (!player) return res.status(404).json({ message: "Player profile not found" });

    // Check if player is in this club
    if (!player.club || String(player.club) !== String(clubId)) {
      return res.status(400).json({ message: "You are not a member of this club" });
    }

    // Leave the club by clearing the club reference
    player.club = null;
    await player.save();

    return res.json({ success: true, message: "Successfully left the club" });
  } catch (err) {
    console.error("❌ Error leaving club:", err);
    res.status(500).json({ message: err.message });
  }
};
