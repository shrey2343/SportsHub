import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    position: {
      type: String,
      enum: ["Forward", "Midfielder", "Defender", "Goalkeeper"],
      default: "Forward",
    },

    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coach",
    },

    // Legacy primary club reference (kept for backward compatibility)
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
    },

    // New: allow multiple club enrollments across different sports
    clubs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club",
      },
    ],

    // Public avatar image URL
    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// 🔁 Keep Club's players[] in sync when player joins/leaves
playerSchema.pre("save", async function (next) {
  const Player = this.constructor;
  const Club = mongoose.model("Club");

  // Sync changes for legacy single club field
  if (this.isModified("club")) {
    if (this._id) {
      const oldPlayer = await Player.findById(this._id).select("club clubs");
      if (oldPlayer?.club) {
        const stillInMulti = Array.isArray(this.clubs) && this.clubs.some((c) => String(c) === String(oldPlayer.club));
        if (!stillInMulti) {
          await Club.findByIdAndUpdate(oldPlayer.club, { $pull: { players: this._id } });
        }
      }
    }
    if (this.club) {
      await Club.findByIdAndUpdate(this.club, { $addToSet: { players: this._id } });
      // ensure clubs[] contains the legacy club
      if (!this.clubs) this.clubs = [];
      if (!this.clubs.find((c) => String(c) === String(this.club))) {
        this.clubs.push(this.club);
      }
    }
  }

  // Sync changes for new clubs[] array
  if (this.isModified("clubs")) {
    const oldPlayer = this._id
      ? await Player.findById(this._id).select("clubs")
      : null;

    const prevClubIds = new Set((oldPlayer?.clubs || []).map((c) => String(c)));
    const newClubIds = new Set((this.clubs || []).map((c) => String(c)));

    // Clubs removed
    for (const cid of prevClubIds) {
      if (!newClubIds.has(cid)) {
        await Club.findByIdAndUpdate(cid, { $pull: { players: this._id } });
      }
    }
    // Clubs added
    for (const cid of newClubIds) {
      if (!prevClubIds.has(cid)) {
        await Club.findByIdAndUpdate(cid, { $addToSet: { players: this._id } });
      }
    }

    // Maintain legacy club pointer if absent
    if (!this.club && this.clubs && this.clubs.length > 0) {
      this.club = this.clubs[this.clubs.length - 1];
    }
    // Clear legacy club if no clubs remain
    if (this.clubs && this.clubs.length === 0) {
      this.club = undefined;
    }
  }

  next();
});

export default mongoose.model("Player", playerSchema);
